using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class SendBoardJoinRequestNotificationResponse: NotificationResponseDto<SendBoardJoinRequestData, NotificationDisplay>
    {
        public SendBoardJoinRequestNotificationResponse()
        {
            Type = ActionTypes.SendBoardJoinRequest;
        }
    }
}
