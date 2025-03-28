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
    }
}
