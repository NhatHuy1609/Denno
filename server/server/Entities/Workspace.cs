using server.Entities;
using server.Enums;

namespace server.Models
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
    }
}
