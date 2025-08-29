using server.Constants;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class JoinBoardByLinkNotificationResponse: NotificationResponseDto<JoinBoardByLinkData, NotificationDisplay>
    {
        public JoinBoardByLinkNotificationResponse()
        {
            Type = ActionTypes.JoinBoardByLink;
        }
    }
}
