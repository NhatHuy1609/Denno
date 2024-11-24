namespace server.Dtos.Response.Users
{
    public class LoginResponseDto
    {
        public bool Success { get; set; } = false;
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public GetUserResponseDto User { get; set; }
    }
}
