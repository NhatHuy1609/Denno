namespace server.Dtos.Response.Users
{
    public class GetUserResponseDto
    {
        public string? Id { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string FullName { get; set; }
    }
}
