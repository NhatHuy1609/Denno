using server.Models;

namespace server.Entities
{
    public class NotificationRecipient
    {
        public string RecipientId { get; set; }
        public AppUser Recipient { get; set; }

        public int NotificationId { get; set; }
        public Notification Notification { get; set; }
    }
}
