namespace server.Entities
{
    public class NotificationRecipient
    {
        public string RecipientId { get; set; }
        public AppUser Recipient { get; set; }

        public int NotificationId { get; set; }
        public Notification Notification { get; set; }

        public bool IsRead { get; set; } = false;
        public DateTime? DateRead { get; set; } = null;
    }
}
