using server.Dtos.Response.Users;
using server.Enums;

namespace server.Dtos.Response.Workspace
{
    public class WorkspaceMemberResponseDto
    {
        public Guid WorkspaceId { get; set; }
        public Guid MemberId { get; set; }
        public GetUserResponseDto Member { get; set; }
        public WorkspaceResponseDto Workspace { get; set; }
        public MemberRole Role { get; set; }
    }
}
