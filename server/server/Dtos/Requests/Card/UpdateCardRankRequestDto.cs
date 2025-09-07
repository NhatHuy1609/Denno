using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Card
{
    public class UpdateCardRankRequestDto
    {
        [Required]
        public Guid BoardId { get; set; }
        public Guid OldCardListId { get; set; }
        public Guid? NewCardListId { get; set; }
        public string? PreviousRank { get; set; }
        public string? NextRank { get; set; }
    }
}
