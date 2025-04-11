using server.Entities;

namespace server.Interfaces
{
    public interface IInvitationSecretRepository
    {
        Task<InvitationSecret?> GetWorkspaceInvitationSecretAsync(Guid workspaceId);
        Task CreateAsync(InvitationSecret invitationSecret);
        Task DeleteWorkspaceInvitationSecretAsync(Guid workspaceId);
    }
}
