using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Card
{
    public class CreateCardRequestDto
    {
        [Required]
        public string Name { get; set; }
        public Guid CardListId { get; set; }
    }
}
