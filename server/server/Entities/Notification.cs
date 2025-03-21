using server.Enums;
using server.Models;
using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public NotificationStatus Status { get; set; }

        public int NotificationObjectId { get; set; }
        public NotificationObject NotificationObject { get; set; }

        public string NotifierId { get; set; }
        public AppUser Notifier { get; set; }
    }
}
