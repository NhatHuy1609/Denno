using server.Constants;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class RejectBoardJoinRequestNotificationResponse: NotificationResponseDto<RejectBoardJoinRequestData, NotificationDisplay>
    {
        public RejectBoardJoinRequestNotificationResponse()
        {
            Type = ActionTypes.RejectBoardJoinRequest;
        }
    }
}
