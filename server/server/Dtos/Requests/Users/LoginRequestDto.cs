using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Users
{
    public class LoginRequestDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
