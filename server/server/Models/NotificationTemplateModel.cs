namespace server.Models
{
    public class NotificationTemplateModel
    {
        public string Message { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string? SenderAvatar { get; set; } = null;
        public string? Description { get; set; }
    }
}
