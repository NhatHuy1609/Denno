namespace server.Entities
{
    public class CardLabel
    {
        public Guid BoardLabelId { get; set; }
        public Guid CardId { get; set; }
        public BoardLabel BoardLabel { get; set; }
        public Card Card { get; set; }
    }
}
