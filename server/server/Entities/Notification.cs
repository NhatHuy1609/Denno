using Newtonsoft.Json;

namespace server.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        public Guid ActionId { get; set; }
        public DennoAction Action { get; set; }

        [JsonIgnore]
        public virtual List<NotificationRecipient> NotificationRecipients { get; set; } = new List<NotificationRecipient>();
    }
}
