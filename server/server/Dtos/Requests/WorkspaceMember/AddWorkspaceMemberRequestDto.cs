using server.Enums;

namespace server.Dtos.Requests.WorkspaceMember
{
    public class AddWorkspaceMemberRequestDto
    {
        public string Email { get; set; }
        public string Description { get; set; } = string.Empty;
        public MemberRole Role { get; set; } = MemberRole.Normal;
    }
}
