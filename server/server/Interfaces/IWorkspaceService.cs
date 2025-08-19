using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Models.Query;

namespace server.Interfaces
{
    public interface IWorkspaceService
    {
        Task<bool> IsWorkspaceMemberAsync(Guid workspaceId, string userId);
        Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query);
    }
}
