using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class InvitationSecretRepository : IInvitationSecretRepository
    {
        private readonly ApplicationDBContext _dbContext;

        public InvitationSecretRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(InvitationSecret invitationSecret)
        {
            await _dbContext.InvitationSecrets.AddAsync(invitationSecret);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteWorkspaceInvitationSecretAsync(Guid workspaceId)
        {
            var invitationSecret = await _dbContext.InvitationSecrets.FirstOrDefaultAsync(i => i.WorkspaceId == workspaceId);

            if (invitationSecret == null)
                return;

            _dbContext.InvitationSecrets.Remove(invitationSecret);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<InvitationSecret?> GetWorkspaceInvitationBySecretCodeAsync(Guid workspaceId, string secretCode)
        {
            return await _dbContext.InvitationSecrets
                .Include(i => i.Inviter)
                .Include(i => i.Workspace)
                .FirstOrDefaultAsync(i => i.WorkspaceId == workspaceId && i.SecretCode == secretCode);
        }

        public async Task<InvitationSecret?> GetWorkspaceInvitationSecretAsync(Guid workspaceId)
        {
            return await _dbContext.InvitationSecrets
                .Include(i => i.Inviter)
                .Include(i => i.Workspace)
                .FirstOrDefaultAsync(i => i.WorkspaceId == workspaceId);  
        }

        public async Task<InvitationSecret?> GetBoardInvitationSecretAsync(Guid boardId)
        {
            return await _dbContext.InvitationSecrets
                .Include(i => i.Inviter)
                .Include(i => i.Board)
                .FirstOrDefaultAsync(i => i.BoardId == boardId && i.Target == InvitationTarget.Board);
        }

        public async Task DeleteBoardInvitationSecretAsync(Guid boardId)
        {
            var invitationSecret = await _dbContext.InvitationSecrets
                .FirstOrDefaultAsync(i => i.BoardId == boardId && i.Target == InvitationTarget.Board);

            if (invitationSecret == null)
                return;

            _dbContext.InvitationSecrets.Remove(invitationSecret);
            await _dbContext.SaveChangesAsync();
        }
    }
}
