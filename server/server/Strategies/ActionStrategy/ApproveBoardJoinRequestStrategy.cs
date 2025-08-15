using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class ApproveBoardJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public ApproveBoardJoinRequestStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.BoardId, nameof(context.BoardId));
            ArgumentNullException.ThrowIfNull(context.TargetUserId, nameof(context.TargetUserId));
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId, nameof(context.MemberCreatorId));

            // Cast the context to ApproveBoardJoinRequestContext
            var castedContext = context as ApproveBoardJoinRequestActionContext ??
                                throw new ArgumentException("Invalid context type for ApproveBoardJoinRequestStrategy");

            var boardMemberRole = castedContext.MemberRole;
            var boardId = context.BoardId.Value;
            var targetUserId = context.TargetUserId;
            var memberCreatorId = context.MemberCreatorId;

            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null)
                throw new InvalidOperationException("Board not found");

            if (board.BoardMembers.Any(m => m.AppUserId == targetUserId))
                throw new InvalidOperationException("User is already a member of this board");

            var newMember = new BoardMember
            {
                BoardId = boardId,
                AppUserId = targetUserId,
                Role = boardMemberRole
            };

            var action = new DennoAction
            {
                MemberCreatorId = memberCreatorId,
                ActionType = ActionTypes.ApproveBoardJoinRequest,
                BoardId = boardId,
                TargetUserId = targetUserId,
                Date = DateTime.Now
            };

            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

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

            var existedJoinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.BoardId == boardId && j.RequesterId == targetUserId);

            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            _dbContext.BoardMembers.Add(newMember);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(notificationRecipients);

            action.MemberCreator = await _dbContext.Users.FindAsync(memberCreatorId);

            return action;
        }

    }
}
