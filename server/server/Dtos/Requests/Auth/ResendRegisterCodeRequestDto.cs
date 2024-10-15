using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Auth
{
    public class ResendRegisterCodeRequestDto
    {
        [EmailAddress]
        public string Email { get; set; }
    }
}
