using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class AssignCardMemberNotificationResponse: NotificationResponseDto<AssignCardMemberData, NotificationDisplay>
    {
        public AssignCardMemberNotificationResponse()
        {
            Type = ActionTypes.AssignCardMember;
        }
    }
}
