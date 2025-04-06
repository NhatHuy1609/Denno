using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class WorkspaceRepository : GenericRepository<Workspace, Guid>, IWorkspaceRepository
    {
        public WorkspaceRepository(ApplicationDBContext context) : base(context)
        {
        }

        public async Task<Workspace?> GetWorkspaceWithMembersAsync(Guid workspaceId)
        {
            var workspace = await _context.Workspaces
                .Include(w => w.WorkspaceMembers)
                .ThenInclude(wm => wm.AppUser)
                .FirstOrDefaultAsync(w => w.Id == workspaceId);

            return workspace;
        }
    }
}
