using server.Entities;

namespace server.Interfaces
{
    public interface IJoinRequestRepository
    {
        Task<JoinRequest?> GetJoinRequestByIdAsync(int id);
        Task<JoinRequest> CreateWorkspaceJoinRequestAsync(string requesterId, Guid workspaceId);
    }
}
