namespace server.Dtos.Requests.Card
{
    public class UpdateCardRankRequestDto
    {
        public Guid OldCardListId { get; set; }
        public Guid? NewCardListId { get; set; }
        public string? PreviousRank { get; set; }
        public string? NextRank { get; set; }
    }
}
