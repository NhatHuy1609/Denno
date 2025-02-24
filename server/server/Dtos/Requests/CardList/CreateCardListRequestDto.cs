using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.CardList
{
    public class CreateCardListRequestDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid BoardId { get; set; }
    }
}
