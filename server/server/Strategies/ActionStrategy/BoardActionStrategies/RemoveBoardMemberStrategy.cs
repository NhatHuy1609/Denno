using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class RemoveBoardMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveBoardMemberStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RemoveBoardMember;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentNullException.ThrowIfNull(context.BoardId);
            ArgumentNullException.ThrowIfNull(context.TargetUserId);

            var boardId = context.BoardId;
            var removedMemberId = context.TargetUserId;
            var memberCreatorId = context.MemberCreatorId;

            var board = await _dbContext.Boards.FindAsync(boardId);

            // Execute remove member logic
            var boardMember = await _dbContext.BoardMembers
                .FirstOrDefaultAsync(bm => bm.AppUserId == context.TargetUserId && bm.BoardId == context.BoardId);
            ArgumentNullException.ThrowIfNull(boardMember);

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.RemoveBoardMember,
                BoardId = context.BoardId,
                TargetUserId = context.TargetUserId,
                IsBoardActivity = true
            };

            var notification = new Notification()
            {
                Date = DateTime.Now,
                Action = action
            };

            var notificationRecipient = new NotificationRecipient()
            {
                Notification = notification,
                RecipientId = removedMemberId
            };

            // Execute data modifications
            var joinedBoardsLeft = await _dbContext.BoardMembers
                .Where(bm => bm.AppUserId == removedMemberId &&
                              bm.BoardId != boardId &&
                              bm.Board.WorkspaceId == board.WorkspaceId)
                .ToListAsync();

            if (!joinedBoardsLeft.Any())
            {
                _dbContext.BoardMembers.Remove(boardMember);
            }

            _dbContext.BoardMembers.Remove(boardMember);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(notificationRecipient);

            return action;
        }
    }
}
