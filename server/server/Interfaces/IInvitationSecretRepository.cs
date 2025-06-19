using server.Entities;

namespace server.Interfaces
{
    public interface IInvitationSecretRepository
    {
        Task<InvitationSecret?> GetBoardInvitationSecretAsync(Guid boardId);
        Task DeleteBoardInvitationSecretAsync(Guid boardId);
        Task<InvitationSecret?> GetWorkspaceInvitationSecretAsync(Guid workspaceId);
        Task<InvitationSecret?> GetWorkspaceInvitationBySecretCodeAsync(Guid worksapceId, string secretCode);
        Task CreateAsync(InvitationSecret invitationSecret);
        Task DeleteWorkspaceInvitationSecretAsync(Guid workspaceId);

    }
}
