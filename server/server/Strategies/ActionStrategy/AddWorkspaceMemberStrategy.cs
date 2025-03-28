using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public class AddWorkspaceMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AddWorkspaceMemberStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DennoAction Execute(DennoActionContext context)
        {
            if (!context.WorkspaceId.HasValue)
                throw new ArgumentNullException(nameof(context.WorkspaceId), "WorkspaceId is required");

            if (string.IsNullOrEmpty(context.TargetUserId))
                throw new ArgumentNullException(nameof(context.TargetUserId), "TargetUserId is required");

            if (string.IsNullOrEmpty(context.MemberCreatorId))
                throw new ArgumentNullException(nameof(context.MemberCreatorId), "MemberCreatorId is required");

            // Action-specific business rules
            if (context.MemberCreatorId == context.TargetUserId)
                throw new InvalidOperationException("User cannot add themselves as a member");

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
                ActionType = ActionTypes.AddMemberToWorkspace,
                WorkspaceId = context.WorkspaceId,
                Date = DateTime.Now,
            };
            _dbContext.Actions.Add(action);

            var notification = new Notification
            {
                Date = DateTime.Now,
                ActionId = action.Id,
            };
            _dbContext.Notifications.Add(notification);

            var recipient = new NotificationRecipient
            {
                NotificationId = notification.Id,
                RecipientId = context.TargetUserId
            };

            _dbContext.NotificationRecipients.Add(recipient);
            _dbContext.WorkspaceMembers.Add(newMember);

            return action;
        }
    }
}
