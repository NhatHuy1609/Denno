using server.Models;

namespace server.Entities
{
    public class NotificationChange
    {
        public int Id { get; set; }

        public int NotificationObjectId { get; set; }
        public NotificationObject NotificationObject { get; set; }

        public string ActorId { get; set; }
        public AppUser Actor { get; set; }
    }
}
