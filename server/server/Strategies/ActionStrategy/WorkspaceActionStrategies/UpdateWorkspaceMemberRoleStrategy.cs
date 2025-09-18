using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Constants;
using server.Data;
using server.Entities;
using server.Models.DennoActionMetaData;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.WorkspaceActionStrategies
{
    public class UpdateWorkspaceMemberRoleStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public UpdateWorkspaceMemberRoleStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.UpdateWorkspaceMemberRole;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var updateContext = context as UpdateWorkspaceMemberRoleActionContext ??
                                         throw new ArgumentException("Invalid context type for UpdateBoardMemberRoleStrategy");

            ArgumentException.ThrowIfNullOrWhiteSpace(updateContext.MemberCreatorId);
            ArgumentNullException.ThrowIfNull(updateContext.TargetUserId);
            ArgumentNullException.ThrowIfNull(updateContext.NewMemberRole);

            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(
                    wm => wm.AppUserId == updateContext.TargetUserId &&
                    wm.WorkspaceId == updateContext.WorkspaceId);

            if (workspaceMember == null)
            {
                throw new Exception("Can not find workspaceMember");
            }

            workspaceMember.Role = updateContext.NewMemberRole;

            var action = new DennoAction()
            {
                MemberCreatorId = updateContext.MemberCreatorId,
                ActionType = ActionTypes.UpdateWorkspaceMemberRole,
                TargetUserId = updateContext.TargetUserId,
                WorkspaceId = updateContext.WorkspaceId,
                MetaData = JsonConvert.SerializeObject(new UpdateWorkspaceMemberRoleMetaData()
                {
                    NewMemberRole = updateContext.NewMemberRole
                })
            };

            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

            var recipient = new NotificationRecipient
            {
                Notification = notification,
                RecipientId = updateContext.TargetUserId
            };

            _dbContext.Update(workspaceMember);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.Add(recipient);

            return action;
        }
    }
}
