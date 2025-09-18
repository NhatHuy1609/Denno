namespace server.Strategies.ActionStrategy.Contexts
{
    public class UpdateCardDatesContext: DennoActionContext
    {
        public string? StartDate { get; set; }
        public string? DueDate { get; set; }
    }
}
