using Google.Apis.Oauth2.v2.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using server.Dtos.Requests.Users;
using server.Dtos.Response.Auth;
using server.Dtos.Response.Users;
using server.Infrastructure.Providers;
using server.Interfaces;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using server.Entities;

namespace server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IFileUploadService _fileUploadService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            IMapper mapper,
            IConfiguration config,
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IFileUploadService fileUploadService,
            IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
            _fileUploadService = fileUploadService;
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                return string.Empty;
            }

            return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        public async Task<GoogleSignInResponseDto> RegisterUserWithGoogleAccount(Userinfo userinfo)
        {
            var response = new GoogleSignInResponseDto();

            var identityUser = await _userManager.FindByEmailAsync(userinfo.Email);

            var appUser = new GetUserResponseDto()
            {
                Email = userinfo.Email,
                Avatar = userinfo.Picture,
                FullName = userinfo.GivenName
            };

            if (identityUser == null)
            {
                response.UserInfo = appUser;
                response.RequiresRegistration = true;
                response.Message = "Email verification successful, finish creating account with password";
            }
            else
            {
                // appUser.Id = identityUser.Id;
                response.RequiresRegistration = false;
                response.RefreshToken = GenerateRefreshTokenString();
                response.AccessToken = await GenerateTokenString(userinfo.Email);
                response.UserInfo = _mapper.Map<GetUserResponseDto>(identityUser);
                response.Message = "Email was used to create account, proceed to login";

                identityUser.RefreshToken = response.RefreshToken;
                identityUser.RefreshTokenExpiry = DateTime.Now.AddDays(JwtTokenProvider.RefreshTokenExpiration);

                await _userManager.UpdateAsync(identityUser);
            }

            return response;
        }

        public async Task<RegisterResponseDto> RegisterUser(RegisterRequestDto registerRequest)
        {
            var response = new RegisterResponseDto();

            var newUser = new AppUser
            {
                FullName = registerRequest.FullName,
                UserName = GenerateUserNameByEmail(registerRequest.Email),
                Email = registerRequest.Email,
            };

            var createdResult = await _userManager.CreateAsync(newUser, registerRequest.Password);

            if (createdResult.Errors.Any())
            {
                var errorMessages = string.Join(",", createdResult.Errors.Select(e => $"{e.Code}::{e.Description}").ToList());

                response.Message = errorMessages;
                return response;
            }

            // Store avatar with cloudinary
            var uploadAvatarResult = await _fileUploadService.UploadPhotoAsync(registerRequest.Avatar);

            if (!uploadAvatarResult.Success)
            {
                response.Message = uploadAvatarResult.ErrorMessage;
                return response;
            }

            // Initialize new created user response
            var userInfo = new GetUserResponseDto()
            {
                Email = registerRequest.Email,
                Avatar = uploadAvatarResult.Url
            };

            response.User = newUser;
            response.RequiresRegistration = true;
            response.Message = "Account created successfully";
            response.AccessToken = await GenerateTokenString(newUser.Email);
            response.RefreshToken = GenerateRefreshTokenString();

            newUser.RefreshTokenExpiry = DateTime.Now.AddDays(JwtTokenProvider.RefreshTokenExpiration);
            newUser.Avatar = uploadAvatarResult.Url;

            await _userManager.UpdateAsync(newUser);

            return response;
        }

        public string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[64];

            using (var numberGenerator = RandomNumberGenerator.Create())
            {
                numberGenerator.GetBytes(randomNumber);
            }

            return Convert.ToBase64String(randomNumber);
        }

        public async Task<string> GenerateTokenString(string userEmail)
        {
            var claims = await GetUserClaims(userEmail);

            var staticKey = _config.GetSection("Jwt:Key").Value;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(staticKey));
            var signingCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var securityToken = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(JwtTokenProvider.AccessTokenExpiration),
                    issuer: _config.GetSection("Jwt:Issuer").Value,
                    audience: _config.GetSection("Jwt:Audience").Value,
                    signingCredentials: signingCred);

            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return tokenString;
        }

        public async Task<LoginResponseDto> RefreshToken(RefreshTokenModel refreshTokenModel)
        {
            var principal = GetTokenPrincipal(refreshTokenModel.JwtToken);

            var response = new LoginResponseDto();

            var emailClaim = principal?.FindFirst(ClaimTypes.Email);

            if (emailClaim is null)
            {
                return response;
            }

            var identityUser = await _userManager.FindByNameAsync(emailClaim.Value);

            if (identityUser is null || identityUser.RefreshToken != refreshTokenModel.RefreshToken || identityUser.RefreshTokenExpiry < DateTime.Now)
            {
                return response;
            }

            response.Success = true;
            response.AccessToken = await GenerateTokenString(emailClaim.Value);
            response.RefreshToken = GenerateRefreshTokenString();

            identityUser.RefreshToken = response.RefreshToken;
            identityUser.RefreshTokenExpiry = DateTime.Now.AddDays(JwtTokenProvider.RefreshTokenExpiration);
            await _userManager.UpdateAsync(identityUser);

            return response;
        }

        private ClaimsPrincipal? GetTokenPrincipal(string token)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value));

            var validation = new TokenValidationParameters()
            {
                IssuerSigningKey = securityKey,
                ValidateLifetime = false,
                ValidateActor = false,
                ValidateIssuer = false,
                ValidateAudience = false,
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }

        private async Task<List<Claim>> GetUserClaims(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            return claims;
        }

        private string GenerateUserNameByEmail(string userEmail)
        {
            var userName = userEmail.Substring(0, userEmail.IndexOf("@"));

            return userName;
        }
    }
}
