using System.ComponentModel;

namespace server.Enums
{
    public enum MemberRole
    {
        [Description("Can view, create and edit Workspace boards, and change settings for the Workspace. Will have admin rights on all boards in this Workspace.")]
        Member = 0,
        [Description("Can view, create, and edit Workspace boards, but not change settings.")]
        Admin = 1
    }
}
