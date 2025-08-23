using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Models.Query;
using server.Models.Results;

namespace server.Interfaces
{
    public interface IWorkspaceService
    {
        Task<bool> LeaveWorkspaceAsync(Guid workspaceId, string userId);
        Task<bool> IsWorkspaceMemberAsync(Guid workspaceId, string userId);
        Task NotifyUserActionToWorkspaceMembers(DennoAction action, Guid workspaceId);
        Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query);
    }
}
