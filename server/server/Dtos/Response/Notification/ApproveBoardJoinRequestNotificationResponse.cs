using server.Constants;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class ApproveBoardJoinRequestNotificationResponse: NotificationResponseDto<ApproveBoardJoinRequestData, NotificationDisplay>
    {
        public ApproveBoardJoinRequestNotificationResponse()
        {
            Type = ActionTypes.ApproveBoardJoinRequest;
        }
    }
}
