using server.Dtos.Requests.Users;
using server.Dtos.Response.Users;
using server.Models;

namespace server.Interfaces
{
    public interface IAuthService
    {
        string GenerateRefreshTokenString();
        Task<string> GenerateTokenString(string userEmail);
        Task<LoginResponseDto> RefreshToken(RefreshTokenModel refreshTokenModel);
        Task<RegisterResponseDto> RegisterUser(RegisterRequestDto registerRequest);
        Task<RegisterResponseDto> RegisterUserWithGoogleAccount(string email);
    }
}
