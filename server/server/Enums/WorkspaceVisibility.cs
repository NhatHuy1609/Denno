using System.ComponentModel;

namespace server.Enums
{
    public enum WorkspaceVisibility
    {
        [Description("This Workspace is private. It's not indexed or visible to those outside the Workspace.")]
        Private = 0,
        [Description("This Workspace is public. It's visible to anyone with the link and will show up in search engines like Google. Only those invited to the Workspace can add and edit Workspace boards.")]
        Public = 1
    }
}
