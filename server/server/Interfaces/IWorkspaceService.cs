using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Models.Query;

namespace server.Interfaces
{
    public interface IWorkspaceService
    {
        Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query);
    }
}
