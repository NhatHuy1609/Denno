using server.Enums;

namespace server.Models
{
    public class BoardRestriction
    {
        public RestrictionVisibility Option { get; set; }

        public Guid BoardId { get; set; }
        public int RestrictionId { get; set; }
        public Restriction Restriction { get; set; }
        public Board Board { get; set; }
    }
}
