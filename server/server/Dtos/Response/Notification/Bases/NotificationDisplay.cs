namespace server.Dtos.Response.Notification.Bases
{
    public class NotificationDisplay
    {
        public Dictionary<string, EntityTypeDisplay> Entities { get; set; }
    }

    public class EntityTypeDisplay
    {
        public object Id { get; set; } // string or Guid type
        public string Type { get; set; } // EntityType constants
        public string Text { get; set; }
        public string? ImageUrl { get; set; }
    }
}
