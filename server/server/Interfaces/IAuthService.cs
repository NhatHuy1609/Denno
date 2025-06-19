using Google.Apis.Oauth2.v2.Data;
using server.Dtos.Requests.Users;
using server.Dtos.Response.Auth;
using server.Dtos.Response.Users;
using server.Models;

namespace server.Interfaces
{
    public interface IAuthService
    {
        string GetCurrentUserId();
        string GenerateRefreshTokenString();
        Task<string> GenerateTokenString(string userEmail);
        Task<LoginResponseDto> RefreshToken(RefreshTokenModel refreshTokenModel);
        Task<RegisterResponseDto> RegisterUser(RegisterRequestDto registerRequest);
        Task<GoogleSignInResponseDto> RegisterUserWithGoogleAccount(Userinfo userinfo);
    }
}
