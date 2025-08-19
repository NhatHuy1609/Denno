using server.Entities;

namespace server.Dtos.Requests.Workspace
{
    public class UpdateWorkspaceMemberRoleRequest
    {
        public WorkspaceMemberRole NewMemberRole { get; set; }
    }
}
