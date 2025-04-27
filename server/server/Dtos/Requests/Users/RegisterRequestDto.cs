using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Users
{
    public class RegisterRequestDto
    {
        [Required]
        public string FullName { get; set; }
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public IFormFile Avatar { get; set; }
    }
}
