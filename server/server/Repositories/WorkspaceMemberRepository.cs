using Microsoft.EntityFrameworkCore;
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

        public async Task<List<WorkspaceMember>> GetWorkspaceMembersAsync(Guid workspaceId)
        {
            var workspaceMembers = await _context.WorkspaceMembers
                .Include(wm => wm.AppUser)
                .ThenInclude(u => u.BoardMembers)
                .ThenInclude(bm => bm.Board)
                .Include(wm => wm.Workspace)
                .Where(wm => wm.WorkspaceId.Equals(workspaceId))
                .ToListAsync();

            return workspaceMembers;
        }
    }
}
