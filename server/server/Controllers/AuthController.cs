using Asp.Versioning;
using AutoMapper;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Requests.Auth;
using server.Dtos.Requests.Users;
using server.Dtos.Response;
using server.Dtos.Response.Users;
using server.Infrastructure.Providers;
using server.Interfaces;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [ControllerName("auth")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly IDataStore _googleDataStore;
        private readonly IGoogleService _googleService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<AppUser> userManager,
            IMapper mapper,
            IAuthService authService,
            IEmailService emailService,
            IDataStore googleDataStore,
            IGoogleService googleService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _mapper = mapper;
            _authService = authService;
            _emailService = emailService;
            _googleService = googleService;
            _logger = logger;
            _googleDataStore = googleDataStore;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null || (await _userManager.CheckPasswordAsync(user, loginDto.Password)) == false )
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "The username or password is incorrect"
                });
            }

            if ((await _userManager.IsEmailConfirmedAsync(user)) == false)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "VerifyEmail::Verify your email to log in to your account"
                });
            }

            var loginResponse = new LoginResponseDto();

            loginResponse.Success = true;
            loginResponse.User = _mapper.Map<GetUserResponseDto>(user);
            loginResponse.RefreshToken = _authService.GenerateRefreshTokenString();
            loginResponse.AccessToken = await _authService.GenerateTokenString(user.Email);

            user.RefreshToken = loginResponse.RefreshToken;
            user.RefreshTokenExpiry = DateTime.Now.AddDays(JwtTokenProvider.RefreshTokenExpiration);

            await _userManager.UpdateAsync(user);

            return Ok(loginResponse);
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var registerResult = await _authService.RegisterUser(registerDto);

            if (registerResult.RequiresRegistration == false)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = registerResult.Message
                });
            }

            registerResult.Message = "Registration successful, please check your email to confirm your account";

            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendConfirmationRegisterAccountEmailAsync(registerDto.Email, registerResult.User);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Failed to send email after retries: {ex.Message}", ex);
                }
            });

            return Ok(registerResult);
        }

        [HttpGet("login-google")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GoogleLogin()
        {
            var authorizationUrl = _googleService.GetAuthorizationUrl();

            return Ok(authorizationUrl);
        }

        [HttpPost("google-sign-in")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GoogleSignInCallback([FromBody] GoogleSignInRequestDto reqDto)
        {
            if (string.IsNullOrEmpty(reqDto.AuthorizationCode))
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.BadRequest,
                    StatusMessage = "Failed to login with your account"
                });
            }

            var googleResponse = await _googleService.GetTokenAsync(reqDto.AuthorizationCode);
            if (googleResponse == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.BadRequest,
                    StatusMessage = "Failed to connect to google"
                });
            }

            var userInfo = await _googleService.GetUserInfoAsync(googleResponse.AccessToken);
            if (userInfo == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.BadRequest,
                    StatusMessage = "Failed to retrieve user information"
                });
            }

            // Execute login with google account
            // If email has not been found in database then create new user with password
            // Otherwise, proceed to login

            var registrationResult = await _authService.RegisterUserWithGoogleAccount(userInfo);

            if (!registrationResult.RequiresRegistration)
            {
                await _googleDataStore.StoreAsync(userInfo.Email, googleResponse);
                return Ok(registrationResult);
            }

            return Accepted(registrationResult);
        }

        [HttpPost("validate-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ValidateEmailRegister([FromBody] ValidateRegisterRequestDto reqDto)
        {
            var user = await _userManager.FindByEmailAsync(reqDto.Email);
            if (user == null)
            {
                return BadRequest();
            }

            var result = await _userManager.ConfirmEmailAsync(user, reqDto.Code);

            if (!result.Succeeded)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "Code is invalid."
                });
            }

            var loginResponse = new LoginResponseDto()
            {
                Success = true,
                AccessToken = await _authService.GenerateTokenString(reqDto.Email),
                RefreshToken = _authService.GenerateRefreshTokenString()
            };

            return Ok(loginResponse);
        }

        [HttpPost("resend-register-code")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResendRegisterCode([FromBody] ResendRegisterCodeRequestDto requestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.BadRequest,
                    StatusMessage = "Invalid information"
                });
            }

            var user = await _userManager.FindByEmailAsync(requestDto.Email);

            if (user == null)
            {
                return NotFound(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.NotFound,
                    StatusMessage = $"Email {requestDto.Email} not found"
                });
            }

            _ = Task.Run(async () =>
            {
                try
                {
                    await _emailService.SendConfirmationRegisterAccountEmailAsync(requestDto.Email, user);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Failed to send email after retries: {ex.Message}", ex);
                }
            });

            return Ok();
        }

        [Authorize]
        [HttpPost("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenModel refreshTokenModel)
        {
            var response = await _authService.RefreshToken(refreshTokenModel);
            if (!response.Success)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "Refresh token failed"
                });
            }

            return Ok(response);
        }

        [Authorize]
        [HttpDelete("revoke")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RevokeToken()
        {
            var username = User?.Identity?.Name;

            if (username == null)
            {
                return BadRequest(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.BadRequest,
                    StatusMessage = "User doesn't exist"
                });
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized(new ApiErrorResponse()
                {
                    StatusCode = Enums.ApiStatusCode.Unauthorized,
                    StatusMessage = "User doesn't exist"
                });
            }

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);

            return Ok();
        }
    }
}
