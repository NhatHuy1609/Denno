namespace server.Entities
{
    public class Card
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Rank { get; set; }
        public string ImageCover { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime ReminderDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsWatching { get; set; } = false;
        public bool IsActive { get; set; } = true;

        public Guid CardListId { get; set; }
        public CardList CardList { get; set; }

        public virtual ICollection<CardMember> CardMembers { get; set; } = new List<CardMember>();

        public virtual ICollection<CardLabel> CardLabels { get; set; } = new List<CardLabel>();

        public virtual ICollection<CardCheckList> CardCheckLists { get; set; } = new List<CardCheckList>();

        public virtual ICollection<CardAttachment> CardAttachments { get; set; } = new List<CardAttachment>();

        public virtual ICollection<CardComment> CardComments { get; set; } = new List<CardComment>();

        public virtual ICollection<DennoAction> Actions { get; set; } = new List<DennoAction>();
    }
}
