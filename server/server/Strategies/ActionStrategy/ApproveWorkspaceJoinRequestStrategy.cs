using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public class ApproveWorkspaceJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public ApproveWorkspaceJoinRequestStrategy(
            ApplicationDBContext dContext)
        {
            _dbContext = dContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            if (!context.WorkspaceId.HasValue)
                throw new ArgumentNullException(nameof(context.WorkspaceId), "WorkspaceId is required");

            if (string.IsNullOrEmpty(context.TargetUserId))
                throw new ArgumentNullException(nameof(context.TargetUserId), "TargetUserId is required");

            if (string.IsNullOrEmpty(context.MemberCreatorId))
                throw new ArgumentNullException(nameof(context.MemberCreatorId), "MemberCreatorId is required");

            if (_dbContext.WorkspaceMembers.Any(m => m.WorkspaceId == context.WorkspaceId && m.AppUserId == context.TargetUserId))
                throw new InvalidOperationException("User is already a member of this workspace");

            var newMember = new WorkspaceMember()
            {
                WorkspaceId = context.WorkspaceId.Value,
                AppUserId = context.TargetUserId
            };

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.ApproveWorkspaceJoinRequest,
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

            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(recipient);
            _dbContext.WorkspaceMembers.Add(newMember);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
