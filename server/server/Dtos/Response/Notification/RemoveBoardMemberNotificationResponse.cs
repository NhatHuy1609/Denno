using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class RemoveBoardMemberNotificationResponse: NotificationResponseDto<RemoveBoardMemberData, NotificationDisplay>
    {
        public RemoveBoardMemberNotificationResponse()
        {
            Type = ActionTypes.RemoveBoardMember;
        }
    }
}
