using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class JoinRequestRepository : IJoinRequestRepository
    {
        private readonly ApplicationDBContext _dbContext;

        public JoinRequestRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<JoinRequest> CreateWorkspaceJoinRequestAsync(string requesterId, Guid workspaceId)
        {
            var newJoinRequest = new JoinRequest()
            {
                RequesterId = requesterId,
                WorkspaceId = workspaceId
            };

            await _dbContext.JoinRequests.AddAsync(newJoinRequest);
            await _dbContext.SaveChangesAsync();

            return newJoinRequest;
        }

        public async Task<JoinRequest?> GetJoinRequestByIdAsync(int id)
        {
            return await _dbContext.JoinRequests
                .Include(j => j.Board)
                .Include(j => j.Workspace)
                .FirstOrDefaultAsync(j => j.Id == id);
        }
    }
}
