using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class WorkspaceMemberRepository : IWorkspaceMemberRepository
    {
        private readonly ApplicationDBContext _context;

        public WorkspaceMemberRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public void AddMember(WorkspaceMember workspaceMember)
        {
            _context.WorkspaceMembers.Add(workspaceMember);
        }
    }
}
