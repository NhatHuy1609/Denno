using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class SendBoardJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public SendBoardJoinRequestStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.BoardId);
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId);

            // Take all needed properties from context
            var boardId = context.BoardId.Value;
            var userId = context.MemberCreatorId;

            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.SendBoardJoinRequest,
                BoardId = boardId,
                Date = DateTime.Now,
                IsBoardActivity = context.IsBoardActivity
            };

            var newJoinRequest = new JoinRequest()
            {
                RequesterId = userId,
                BoardId = boardId
            };

            // Create notifications for user who is admin of the related workspace
            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

            // Notify all members in the board if they are watching the board
            var notificationRecipients = await _dbContext.BoardMembers
                .Where(bm => bm.BoardId == boardId)
                .Join(
                    _dbContext.BoardUserSettings.Where(bu => bu.BoardId == boardId && bu.IsWatching),
                    bm => new { bm.BoardId, UserId = bm.AppUserId },
                    bu => new { bu.BoardId, bu.UserId },
                    (bm, bu) => new NotificationRecipient
                    {
                        Notification = notification,
                        RecipientId = bm.AppUserId
                    }
                )
                .ToListAsync();

            _dbContext.JoinRequests.Add(newJoinRequest);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(notificationRecipients);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
