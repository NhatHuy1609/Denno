using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Cms;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class JoinWorkspaceByLinkStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public JoinWorkspaceByLinkStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            if (!context.WorkspaceId.HasValue)
                throw new ArgumentNullException(nameof(context.WorkspaceId), "WorkspaceId is required");

            if (string.IsNullOrEmpty(context.MemberCreatorId))
                throw new ArgumentNullException(nameof(context.MemberCreatorId), "MemberCreatorId is required");

            var workspace = await _dbContext.Workspaces
                .Include(w => w.WorkspaceMembers)
                .FirstOrDefaultAsync(w => w.Id == context.WorkspaceId);

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.JoinWorkspaceByLink,
                WorkspaceId = context.WorkspaceId,
                Date = DateTime.Now
            };

            var newMember = new WorkspaceMember()
            {
                WorkspaceId = context.WorkspaceId.Value,
                AppUserId = context.MemberCreatorId
            };

            var notification = new Notification()
            {
                Date = DateTime.Now,
                Action = action
            };

            // Notify to all members in workspace
            var notificationRecipients = workspace.WorkspaceMembers
                .Select(wm => new NotificationRecipient()
                {
                    Notification = notification,
                    RecipientId = wm.AppUserId
                });

            // Delete workspace join requests related to user who joined workspace
            var existedJoinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.WorkspaceId == context.WorkspaceId && j.RequesterId == context.MemberCreatorId);

            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(notificationRecipients);
            _dbContext.WorkspaceMembers.Add(newMember);

            // Load needed navigation properties
            action.MemberCreator = await _dbContext.Users.FindAsync(context.MemberCreatorId);

            return action;
        }
    }
}
