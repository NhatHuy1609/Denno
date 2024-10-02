using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using server.Dtos.Requests.Users;
using server.Dtos.Response.Users;
using server.Interfaces;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthService(
            IConfiguration config,
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<RegisterResponseDto> RegisterUserWithGoogleAccount(string email)
        {
            var response = new RegisterResponseDto();

            var identityUser = await _userManager.FindByEmailAsync(email);

            if (identityUser == null)
            {
                response.RequiresRegistration = true;
                response.Message = "Email verification successful, finish creating account with password";
            }
            else
            {
                response.RequiresRegistration = false;
                response.Message = "Email was used to create account, proceed to login";
                response.AccessToken = await GenerateTokenString(identityUser.Email ?? "");
                response.RefreshToken = GenerateRefreshTokenString();
            }

            return response;
        }

        public async Task<RegisterResponseDto> RegisterUser(RegisterRequestDto registerRequest)
        {
            var response = new RegisterResponseDto();

            var newUser = new AppUser
            {
                FullName = registerRequest.FullName,
                UserName = registerRequest.Email,
                Email = registerRequest.Email,
            };

            var createdResult = await _userManager.CreateAsync(newUser, registerRequest.Password);

            if (createdResult.Errors.Any())
            {
                var errorMessages = string.Join(",", createdResult.Errors.Select(e => $"{e.Code}::{e.Description}").ToList());

                response.Message = errorMessages;
                return response;
            }

            var userInfo = new GetUserResponseDto()
            {
                Email = registerRequest.Email,
            };

            response.User = newUser;
            response.UserInfo = userInfo;
            response.RequiresRegistration = true;
            response.Message = "Account created successfully";
            response.AccessToken = await GenerateTokenString(registerRequest.Email);
            response.RefreshToken = GenerateRefreshTokenString();

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
                    expires: DateTime.Now.AddMinutes(60),
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

            if (principal?.Identity?.Name is null)
            {
                return response;
            }

            var identityUser = await _userManager.FindByNameAsync(principal.Identity.Name);

            if (identityUser is null || identityUser.RefreshToken != refreshTokenModel.RefreshToken || identityUser.RefreshTokenExpiry < DateTime.Now)
            {
                return response;
            }

            response.Success = true;
            response.AccessToken = await GenerateTokenString(principal.Identity.Name);
            response.RefreshToken = GenerateRefreshTokenString();

            identityUser.RefreshToken = response.RefreshToken;
            identityUser.RefreshTokenExpiry = DateTime.Now.AddDays(7);
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
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            return claims;
        }
    }
}
