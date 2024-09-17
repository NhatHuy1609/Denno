using Newtonsoft.Json;
using server.Models;

namespace server.Dtos.Response.Users
{
    public class RegisterResponseDto
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool RequiresRegistration { get; set; } = false;

        [JsonIgnore]
        public AppUser User { get; set; }
    }
}
