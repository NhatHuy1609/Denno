using server.Enums;

namespace server.Entities
{
    public class Workspace
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public WorkspaceVisibility Visibility { get; set; } = 0;

        public string OwnerId { get; set; }
        public AppUser Owner { get; set; }

        public FileUpload Logo { get; set; }

        public ICollection<Board> Boards { get; set; } = new List<Board>();
        public virtual ICollection<WorkspaceMember> WorkspaceMembers { get; set; } = new List<WorkspaceMember>();
        public virtual ICollection<WorkspaceGuest> WorkspaceGuests { get; set; } = new List<WorkspaceGuest>();
        public virtual ICollection<DennoAction> Actions { get; set; } = new List<DennoAction>();
        public virtual ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();
    }
}
