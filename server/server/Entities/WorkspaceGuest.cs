namespace server.Entities
{
    public class WorkspaceGuest
    {
        public Guid WorkspaceId { get; set; }
        public Workspace? Workspace { get; set; }

        public string GuestId { get; set; } = string.Empty;
        public AppUser? Guest { get; set; }
    }
}
