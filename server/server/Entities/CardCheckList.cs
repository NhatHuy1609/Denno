namespace server.Entities
{
    public class CardCheckList
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public Guid CardId { get; set; }
        public Card Card { get; set; }

        public virtual ICollection<CardCheckListItem> CardCheckListItems { get; set; } = new List<CardCheckListItem>();
    }
}
