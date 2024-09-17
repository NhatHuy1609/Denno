using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Auth
{
    public class EmailConfirmRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
