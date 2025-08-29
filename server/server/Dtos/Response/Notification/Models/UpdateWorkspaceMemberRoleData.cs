using server.Entities;

namespace server.Dtos.Response.Notification.Models
{
    public class UpdateWorkspaceMemberRoleData
    {
        public string MemberCreatorId { get; set; }
        public string UpdatedMemberId { get; set; }
        public Guid WorkspaceId { get; set; }
        public WorkspaceMemberRole NewMemberRole { get; set; }
    }
}
