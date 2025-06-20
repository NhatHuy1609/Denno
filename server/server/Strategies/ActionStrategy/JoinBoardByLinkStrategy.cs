using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class JoinBoardByLinkStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public JoinBoardByLinkStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId, "MemberCreatorId is required");

            if (context.BoardId == null || context.BoardId == Guid.Empty)
            {
                throw new ArgumentException("BoardId is required");
            }

            var boardId = context.BoardId.Value;
            var memberId = context.MemberCreatorId;

            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            var action = new DennoAction
            {
                MemberCreatorId = memberId,
                ActionType = ActionTypes.JoinBoardByLink,
                BoardId = boardId,
                Date = DateTime.Now,
                IsBoardActivity = context.IsBoardActivity
            };

            var newMember = new BoardMember
            {
                BoardId = boardId,
                AppUserId = memberId
            };

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

            // Delete board join requests related to the user who joined the board
            var joinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.BoardId == boardId && j.RequesterId == memberId);

            if (joinRequest != null)
                _dbContext.JoinRequests.Remove(joinRequest);

            _dbContext.BoardMembers.Add(newMember);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(notificationRecipients);

            action.MemberCreator = await _dbContext.Users.FindAsync(memberId);

            return action;
        }
    }
}
