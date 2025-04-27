using server.Entities;

namespace server.Interfaces
{
    public interface IWorkspaceRepository: IGenericRepository<Workspace, Guid>
    {
        Task<Workspace?> GetWorkspaceWithMembersAsync(Guid workspaceId);
    }
}
