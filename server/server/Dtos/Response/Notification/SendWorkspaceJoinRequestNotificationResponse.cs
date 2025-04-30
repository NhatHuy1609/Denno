using server.Constants;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class SendWorkspaceJoinRequestNotificationResponse: NotificationResponseDto<SendWorkspaceJoinRequestData, NotificationDisplay>
    {
        public SendWorkspaceJoinRequestNotificationResponse()
        {
            this.Type = ActionTypes.SendWorkspaceJoinRequest;
        }
    }
}
