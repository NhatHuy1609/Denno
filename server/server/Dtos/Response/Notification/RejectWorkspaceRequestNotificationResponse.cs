using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class RejectWorkspaceRequestNotificationResponse: NotificationResponseDto<RejectWorkspaceRequestData, NotificationDisplay>
    {
        public RejectWorkspaceRequestNotificationResponse()
        {
            this.Type = ActionTypes.RejectWorkspaceJoinRequest;
        }
    }
}
