using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Users
{
    public class RegisterRequestDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
