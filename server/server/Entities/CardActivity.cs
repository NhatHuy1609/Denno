
using server.Enums;

namespace server.Models
{
    public class CardActivity
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public ActionType ActionType { get; set; }

        public Guid CardId { get; set; }
        public string AppUserId { get; set; }
        public Card Card { get; set; }
        public AppUser AppUser { get; set; }
    }
}
