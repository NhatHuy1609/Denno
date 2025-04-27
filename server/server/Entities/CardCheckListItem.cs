namespace server.Entities
{
    public class CardCheckListItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public DateTime ReminderDate { get; set; }
        public bool IsChecked { get; set; } = false;
        public int Position { get; set; }

        public Guid CardCheckListId { get; set; }
        public CardCheckList CardCheckList { get; set; }

        public string AsigneeId { get; set; }
        public AppUser Asignee { get; set; }
    }
}
