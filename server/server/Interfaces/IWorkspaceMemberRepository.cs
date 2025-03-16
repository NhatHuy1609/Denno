using server.Models;

namespace server.Interfaces
{
    public class WorkspaceMemberKey
    {
        public Guid WorkspaceId { get; set; }
        public string AppUserId { get; set; } = string.Empty;

        public override bool Equals(object? obj)
        {
            if (obj is not WorkspaceMemberKey other) return false;
            return WorkspaceId == other.WorkspaceId && AppUserId == other.AppUserId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(WorkspaceId, AppUserId);
        }
    }

    public interface IWorkspaceMemberRepository
    {
        void Add(WorkspaceMember workspaceMember);
    }
}
