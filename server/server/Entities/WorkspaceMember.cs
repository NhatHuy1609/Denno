using server.Enums;

namespace server.Models
{
    public class WorkspaceMember
    {
        public Guid WorkspaceId { get; set; }
        public Workspace? Workspace { get; set; }

        public string AppUserId { get; set; } = string.Empty;
        public AppUser? AppUser { get; set; }

        public MemberRole Role { get; set; } = MemberRole.Normal;
    }
}
