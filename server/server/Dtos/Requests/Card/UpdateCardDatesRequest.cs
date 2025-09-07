namespace server.Dtos.Requests.Card
{
    public class UpdateCardDatesRequest
    {
        public string? StartDate { get; set; }
        public string? DueDate { get; set; }
        public Guid BoardId { get; set; }
    }
}
