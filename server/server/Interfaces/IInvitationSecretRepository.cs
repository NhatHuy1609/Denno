using server.Entities;

namespace server.Interfaces
{
    public interface IInvitationSecretRepository
    {
        Task<InvitationSecret?> GetWorkspaceInvitationSecretAsync(Guid workspaceId);
        Task<InvitationSecret?> GetWorkspaceInvitationBySecretCodeAsync(Guid worksapceId, string secretCode);
        Task CreateAsync(InvitationSecret invitationSecret);
        Task DeleteWorkspaceInvitationSecretAsync(Guid workspaceId);
    }
}
