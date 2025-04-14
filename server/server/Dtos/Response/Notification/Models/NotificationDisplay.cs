namespace server.Dtos.Response.Notification.Models
{
    public class NotificationDisplay
    {
        public string TranslationKey { get; set; }
        public Dictionary<string, EntityTypeDisplay> Entities { get; set; }
    }

    public class EntityTypeDisplay
    {
        public object Id { get; set; } // string or Guid type
        public string Type { get; set; } // EntityType constants
        public string Text { get; set; }
    }
}
