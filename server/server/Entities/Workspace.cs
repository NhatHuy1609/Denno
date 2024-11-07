using server.Enums;

namespace server.Models
{
    public class Workspace
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string LogoUrl { get; set; } = string.Empty;
        public required string Description { get; set; }
        public WorkspaceVisibility Visibility { get; set; } = 0;

        public string OwnerId { get; set; }
        public AppUser Owner { get; set; }

        public virtual ICollection<WorkspaceMember> WorkspaceMembers { get; set; } = new List<WorkspaceMember>();

        public ICollection<Board> Boards { get; set; } = new List<Board>();
    }
}
