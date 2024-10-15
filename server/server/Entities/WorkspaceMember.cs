namespace server.Models
{
    public class WorkspaceMember
    {
        public Guid WorkspaceId { get; set; }
        public string AppUserId { get; set; } = string.Empty;
        public Workspace? Workspace { get; set; }
        public AppUser? AppUser { get; set; }
    }
}
