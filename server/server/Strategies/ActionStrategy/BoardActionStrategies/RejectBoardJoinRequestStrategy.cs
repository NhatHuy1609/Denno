using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class RejectBoardJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RejectBoardJoinRequestStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RejectBoardJoinRequest;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.BoardId, nameof(context.BoardId));
            ArgumentNullException.ThrowIfNull(context.TargetUserId, nameof(context.TargetUserId));
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId, nameof(context.MemberCreatorId));

            // Take all needed properties from context
            var boardId = context.BoardId.Value;
            var targetUserId = context.TargetUserId;
            var memberCreatorId = context.MemberCreatorId;

            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null)
                throw new InvalidOperationException("Board not found");

            var action = new DennoAction
            {
                MemberCreatorId = memberCreatorId,
                ActionType = ActionTypes.RejectBoardJoinRequest,
                BoardId = boardId,
                TargetUserId = targetUserId,
                Date = DateTime.Now
            };

            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

            var recipient = new NotificationRecipient
            {
                Notification = notification,
                RecipientId = context.TargetUserId
            };

            // Delete board join request if exists
            var existedJoinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.BoardId == boardId && j.RequesterId == targetUserId);

            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(recipient);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(memberCreatorId);

            return action;
        }
    }
}
