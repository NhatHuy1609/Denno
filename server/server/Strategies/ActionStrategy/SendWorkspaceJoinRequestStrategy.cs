using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public class SendWorkspaceJoinRequestStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public SendWorkspaceJoinRequestStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.WorkspaceId);
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId);

            var workspace = await _dbContext.Workspaces
                .Include(w => w.WorkspaceMembers)
                .FirstOrDefaultAsync(w => w.Id == context.WorkspaceId);

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.SendWorkspaceJoinRequest,
                WorkspaceId = context.WorkspaceId,
                Date = DateTime.Now
            };

            var newJoinRequest = new JoinRequest()
            {
                RequesterId = context.MemberCreatorId,
                WorkspaceId = context.WorkspaceId
            };

            // Create notifications for user who is admin of the related workspace
            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

            var recipients = workspace.WorkspaceMembers
                .Where(wm => wm.Role == Enums.MemberRole.Admin)
                .Select(wm => new NotificationRecipient()
                {
                    Notification = notification,
                    RecipientId = wm.AppUserId
                })
                .ToList();

            _dbContext.JoinRequests.Add(newJoinRequest);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(recipients);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
