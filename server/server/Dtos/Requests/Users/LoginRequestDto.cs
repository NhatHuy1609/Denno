using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Users
{
    public class LoginRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
