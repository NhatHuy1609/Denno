using server.Entities;

namespace server.Interfaces
{
    public interface IWorkspaceMemberRepository
    {
        void AddMember(WorkspaceMember workspaceMember);
    }
}
