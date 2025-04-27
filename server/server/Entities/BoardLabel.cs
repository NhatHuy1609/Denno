namespace server.Entities
{
    public class BoardLabel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;

        public Guid BoardId { get; set; }
        public Board Board { get; set; }

        public virtual ICollection<CardLabel> CardLabels { get; set; } = new List<CardLabel>();
    }
}
