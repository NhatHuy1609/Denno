using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.WorkspaceActionStrategies
{
    public class RejectWorkspaceJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RejectWorkspaceJoinRequestStrategy(
            ApplicationDBContext dContext)
        {
            _dbContext = dContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RejectWorkspaceJoinRequest;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            if (!context.WorkspaceId.HasValue)
                throw new ArgumentNullException(nameof(context.WorkspaceId), "WorkspaceId is required");

            if (string.IsNullOrEmpty(context.TargetUserId))
                throw new ArgumentNullException(nameof(context.TargetUserId), "TargetUserId is required");

            if (string.IsNullOrEmpty(context.MemberCreatorId))
                throw new ArgumentNullException(nameof(context.MemberCreatorId), "MemberCreatorId is required");

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.RejectWorkspaceJoinRequest,
                WorkspaceId = context.WorkspaceId,
                TargetUserId = context.TargetUserId,
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

            // Delete workspace join requests related to user was added
            var existedJoinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.WorkspaceId == context.WorkspaceId && j.RequesterId == context.TargetUserId);

            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(recipient);

            // Load needed navigation properties
            await _dbContext.Entry(action)
                .Reference(a => a.MemberCreator)
                .LoadAsync();
                
            //action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
