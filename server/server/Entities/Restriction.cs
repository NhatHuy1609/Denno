using server.Enums;

namespace server.Models
{
    public class Restriction
    {
        public int Id { get; set; }
        public RestrictionType RestrictionType { get; set; }
        public WorkStructure ApplyTo { get; set; }
        public RestrictionVisibility Visibility { get; set; } = RestrictionVisibility.Private;

        public virtual ICollection<BoardRestriction> BoardRestrictions { get; set; } = new List<BoardRestriction>();
    }
}
