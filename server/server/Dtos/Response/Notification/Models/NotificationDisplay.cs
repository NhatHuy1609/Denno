namespace server.Dtos.Response.Notification.Models
{
    public class NotificationDisplay
    {
        public string TranslationKey { get; set; }
        public Dictionary<string, EntityTypeDisplay> Entities { get; set; }
    }
}
