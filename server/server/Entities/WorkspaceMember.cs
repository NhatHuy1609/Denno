using server.Enums;
using System.ComponentModel;

namespace server.Entities
{
    public class WorkspaceMember
    {
        public Guid WorkspaceId { get; set; }
        public Workspace? Workspace { get; set; }

        public string AppUserId { get; set; } = string.Empty;
        public AppUser? AppUser { get; set; }

        public WorkspaceMemberRole Role { get; set; } = WorkspaceMemberRole.Normal;
    }

    public enum WorkspaceMemberRole
    {
        [Description("Can view, create and edit Workspace boards, and change settings for the Workspace. Will have admin rights on all boards in this Workspace.")]
        Normal = 0,
        [Description("Can view, create, and edit Workspace boards, but not change settings.")]
        Admin = 1
    }
}
