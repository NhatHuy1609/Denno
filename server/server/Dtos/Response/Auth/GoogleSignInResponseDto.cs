using server.Dtos.Response.Users;

namespace server.Dtos.Response.Auth
{
    public class GoogleSignInResponseDto
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }

        public bool RequiresRegistration { get; set; }
        public string Message { get; set; } = string.Empty;
        public GetUserResponseDto UserInfo { get; set; }
    }
}
