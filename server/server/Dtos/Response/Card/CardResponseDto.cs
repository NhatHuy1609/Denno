namespace server.Dtos.Response.Card
{
    public class CardResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Rank { get; set; }
        public string ImageCover { get; set; }
        public string Description { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ReminderDate { get; set; }
        public string Location { get; set; }
        public bool IsWatching { get; set; }
        public bool IsActive { get; set; }
        public Guid CardListId { get; set; }
        public bool IsOverdue { get; set; }
    }
}
