namespace server.Entities
{
    public class CardComment
    {
        public Guid Id { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedDate { get; set; }

        public Guid CardId { get; set; }
        public string AppUserId { get; set; }
        public Card Card { get; set; }
        public AppUser AppUser { get; set; }
    }
}
