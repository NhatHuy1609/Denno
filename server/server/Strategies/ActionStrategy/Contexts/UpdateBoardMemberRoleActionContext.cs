using server.Entities;

namespace server.Strategies.ActionStrategy.Contexts
{
    public class UpdateBoardMemberRoleActionContext : DennoActionContext
    {
        public BoardMemberRole TargetMemberRole { get; set; }
    }
}
