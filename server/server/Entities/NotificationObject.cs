﻿using server.Enums;
using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class NotificationObject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public EntityType EntityType { get; set; }

        [Required]
        public Guid EntityId { get; set; }
        public DateTime CreatedOn { get; set; }
        public NotificationObjectStatus Status { get; set; }

        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public virtual ICollection<NotificationChange> NotificationChanges { get; set; } = new List<NotificationChange>();
    }
}
