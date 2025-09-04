using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class RemoveWorkspaceMemberNotificationResponse : NotificationResponseDto<RemoveWorkspaceMemberData, NotificationDisplay>
    {
        public RemoveWorkspaceMemberNotificationResponse()
        {
            Type = ActionTypes.RemoveWorkspaceMember;
        }
    }
}
