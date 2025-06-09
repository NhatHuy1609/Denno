using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class AddBoardMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AddBoardMemberStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            if (!context.BoardId.HasValue)
                throw new ArgumentNullException(nameof(context.BoardId), "BoardId is required");

            if (string.IsNullOrEmpty(context.TargetUserId))
                throw new ArgumentNullException(nameof(context.TargetUserId), "TargetUserId is required");

            if (string.IsNullOrEmpty(context.MemberCreatorId))
                throw new ArgumentNullException(nameof(context.MemberCreatorId), "MemberCreatorId is required");

            // Action-specific business rules
            if (context.MemberCreatorId == context.TargetUserId)
                throw new InvalidOperationException("User cannot add themselves as a member");

            if (_dbContext.BoardMembers.Any(m => m.BoardId == context.BoardId && m.AppUserId == context.TargetUserId))
                throw new InvalidOperationException("User is already a member of this board");

            var newMember = new BoardMember()
            {
                BoardId = context.BoardId.Value,
                AppUserId = context.TargetUserId
            };

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.AddMemberToBoard,
                IsBoardActivity = context.IsBoardActivity,
                BoardId = context.BoardId,
                TargetUserId = context.TargetUserId
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

            // Delete board join requests related to user was added
            var existedJoinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.BoardId == context.BoardId && j.RequesterId == context.TargetUserId);

            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(recipient);
            _dbContext.BoardMembers.Add(newMember);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
