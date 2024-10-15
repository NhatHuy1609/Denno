using server.Data;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{
    public class WorkspaceRepository : GenericRepository<Workspace, Guid>, IWorkspaceRepository
    {
        public WorkspaceRepository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
