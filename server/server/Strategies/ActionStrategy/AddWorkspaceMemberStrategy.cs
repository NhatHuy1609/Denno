using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class AddWorkspaceMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AddWorkspaceMemberStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
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

            if (_dbContext.WorkspaceMembers
                .Any(m => m.WorkspaceId == context.WorkspaceId && 
                    m.AppUserId == context.TargetUserId && 
                    m.Role != WorkspaceMemberRole.Guest)
                )
            {
                throw new InvalidOperationException("User is already a member of this workspace");
            }

            var workspaceId = context.WorkspaceId;
            var addedToWorkspaceUserId = context.TargetUserId;
            var memberCreatorId = context.MemberCreatorId;

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

            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == addedToWorkspaceUserId);

            // Execute data modifications
            if (existedJoinRequest != null)
            {
                _dbContext.JoinRequests.Remove(existedJoinRequest);
            }

            if (workspaceMember != null && workspaceMember.Role == WorkspaceMemberRole.Guest)
            {
                workspaceMember.Role = WorkspaceMemberRole.Normal;
                _dbContext.Update(workspaceMember);
            }

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
