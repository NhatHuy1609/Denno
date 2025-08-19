using server.Entities;

namespace server.Strategies.ActionStrategy.Contexts
{
    public class UpdateWorkspaceMemberRoleActionContext: DennoActionContext
    {
        public WorkspaceMemberRole NewMemberRole { get; set; }
    }
}
