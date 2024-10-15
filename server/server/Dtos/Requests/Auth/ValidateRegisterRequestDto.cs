using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Auth
{
    public class ValidateRegisterRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Code { get; set; }
    }
}
