namespace server.Entities
{
    public class BoardMember
    {
        public string AppUserId { get; set; }
        public Guid BoardId { get; set; }
        public AppUser AppUser { get; set; }
        public Board Board { get; set; }
    }
}
