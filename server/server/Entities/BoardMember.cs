using System.ComponentModel;

namespace server.Entities
{
    public class BoardMember
    {
        public string AppUserId { get; set; }
        public Guid BoardId { get; set; }
        public AppUser AppUser { get; set; }
        public Board Board { get; set; }
        public BoardMemberRole Role { get; set; } = BoardMemberRole.Member;
    }

    public enum BoardMemberRole
    {
        [Description("Can only view and comment on the board.")]
        Observer = 0,

        [Description("Can add, delete, and edit items on the board.")]
        Member = 1
    }
}
