using server.Data;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{
    public class WorkspaceMemberRepository : IWorkspaceMemberRepository
    {
        private readonly ApplicationDBContext _context;

        public WorkspaceMemberRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public void Add(WorkspaceMember workspaceMember)
        {
            _context.WorkspaceMembers.Add(workspaceMember);
        }
    }
}
