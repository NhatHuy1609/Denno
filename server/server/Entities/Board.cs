using server.Enums;

namespace server.Models
{
    public class Board
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool StarredStatus { get; set; } = false;
        public BoardVisibility Visibility { get; set; }

        public Guid WorkspaceId { get; set; }
        public Workspace Workspace { get; set; }

        public virtual ICollection<BoardRestriction> BoardRestrictions { get; set; } = new List<BoardRestriction>();

        public virtual ICollection<BoardMember> BoardMembers { get; set; } = new List<BoardMember>();

        public virtual ICollection<CardList> CardLists { get; set; } = new List<CardList>();

        public virtual ICollection<BoardLabel> BoardLabels { get; set; } = new List<BoardLabel>();
    }
}
