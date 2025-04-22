using server.Constants;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class ApproveWorkspaceJoinRequestNotificationResponse: NotificationResponseDto<ApproveWorkspaceJoinRequestData, NotificationDisplay>
    {
        public ApproveWorkspaceJoinRequestNotificationResponse()
        {
            Type = ActionTypes.ApproveWorkspaceJoinRequest;
        }
    }
}
