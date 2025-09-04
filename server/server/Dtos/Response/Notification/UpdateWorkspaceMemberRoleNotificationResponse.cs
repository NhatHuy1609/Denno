using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class UpdateWorkspaceMemberRoleNotificationResponse: NotificationResponseDto<UpdateWorkspaceMemberRoleData, NotificationDisplay>
    {
        public UpdateWorkspaceMemberRoleNotificationResponse()
        {
            this.Type = ActionTypes.UpdateWorkspaceMemberRole;
        }
    }
}
