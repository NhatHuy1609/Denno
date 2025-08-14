using server.Entities;
using server.Enums;

namespace server.Dtos.Requests.Workspace
{
    public class AddWorkspaceMemberRequestDto
    {
        public string Email { get; set; }
        public string Description { get; set; } = string.Empty;
        public WorkspaceMemberRole Role { get; set; } = WorkspaceMemberRole.Normal;
    }
}
