namespace server.Models
{
    public class CardMember
    {
        public string AppUserId { get; set; }
        public Guid CardId { get; set; }
        public AppUser AppUser { get; set; }
        public Card Card { get; set; }
    }
}
