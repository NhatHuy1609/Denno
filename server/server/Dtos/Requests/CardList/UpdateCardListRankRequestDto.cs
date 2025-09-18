using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.CardList
{
    public class UpdateCardListRankRequestDto
    {
        public string? PreviousRank { get; set; }
        public string? NextRank { get; set; }
        [Required]
        public Guid BoardId { get; set; }
    }
}
