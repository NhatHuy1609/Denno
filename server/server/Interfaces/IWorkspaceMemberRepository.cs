using server.Models;

namespace server.Interfaces
{
    public interface IWorkspaceMemberRepository
    {
        void AddMember(WorkspaceMember workspaceMember);
    }
}
