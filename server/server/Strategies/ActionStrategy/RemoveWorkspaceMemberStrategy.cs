using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class RemoveWorkspaceMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveWorkspaceMemberStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.WorkspaceId);
            ArgumentNullException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentNullException.ThrowIfNullOrWhiteSpace(context.TargetUserId);

            var workspaceId = context.WorkspaceId;
            var removedUserId = context.TargetUserId;
            var memberCreatorId = context.MemberCreatorId;


            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == removedUserId);

            ArgumentNullException.ThrowIfNull(workspaceMember);

            var action = new DennoAction()
            {
                MemberCreatorId = memberCreatorId,
                WorkspaceId = workspaceId,
                TargetUserId = removedUserId,
                ActionType = ActionTypes.RemoveWorkspaceMember
            };

            _dbContext.Actions.Add(action);
            _dbContext.WorkspaceMembers.Remove(workspaceMember);

            return action;
        }
    }
}
