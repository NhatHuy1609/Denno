using server.Entities;

namespace server.Strategies.ActionStrategy.Contexts
{
    public class ApproveBoardJoinRequestActionContext : DennoActionContext
    {
        public BoardMemberRole MemberRole { get; set; }
    }
}
