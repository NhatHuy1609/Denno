using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class RemoveWorkspaceGuestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveWorkspaceGuestStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RemoveWorkspaceGuest;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.WorkspaceId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.TargetUserId);

            var removedGuestId = context.TargetUserId;
            var workspaceId = context.WorkspaceId;
            var memberCreatorId = context.MemberCreatorId;

            var joinedBoardsAsMember = await _dbContext.BoardMembers
                .Where(bm => bm.Board.WorkspaceId == workspaceId && bm.AppUserId == removedGuestId)
                .ToListAsync();

            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == removedGuestId && wm.Role == WorkspaceMemberRole.Guest);

            if (workspaceMember == null)
            {
                throw new ArgumentException($"Deleted workspace guest with id-{removedGuestId} does not exist");
            }

            // Create new entities

            var action = new DennoAction()
            {
                WorkspaceId = workspaceId,
                MemberCreatorId = memberCreatorId,
                TargetUserId = removedGuestId,
                ActionType = ActionTypes.RemoveWorkspaceGuest
            };

            var notification = new Notification()
            {
                Date = DateTime.Now,
                Action = action
            };

            var notificationRecipient = new NotificationRecipient()
            {
                Notification = notification,
                RecipientId = removedGuestId
            };

            // Execute data modifications

            _dbContext.Actions.Add(action);
            _dbContext.BoardMembers.RemoveRange(joinedBoardsAsMember);
            _dbContext.WorkspaceMembers.Remove(workspaceMember);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(notificationRecipient);

            return action;
        }
    }
}
