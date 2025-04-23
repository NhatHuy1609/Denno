using server.Entities;

namespace server.Interfaces
{
    public interface IJoinRequestRepository
    {
        Task<JoinRequest?> GetJoinRequestByIdAsync(int id);
        Task<IEnumerable<JoinRequest>> GetJoinRequestsByWorkspaceId(Guid workspaceId);
        Task<JoinRequest> CreateWorkspaceJoinRequestAsync(string requesterId, Guid workspaceId);
    }
}
