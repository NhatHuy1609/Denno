namespace server.Entities
{
    public class BoardUserSettings
    {
        public string UserId { get; set; }
        public Guid BoardId { get; set; }

        public bool IsWatching { get; set; } = false;

        public AppUser User { get; set; } = default;
        public Board Board { get; set; } = default;
    }
}
