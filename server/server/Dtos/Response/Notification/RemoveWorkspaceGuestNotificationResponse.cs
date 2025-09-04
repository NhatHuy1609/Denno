using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class RemoveWorkspaceGuestNotificationResponse: NotificationResponseDto<RemoveWorkspaceGuestData, NotificationDisplay>
    {
        public RemoveWorkspaceGuestNotificationResponse()
        {
            Type = ActionTypes.RemoveWorkspaceGuest;
        }
    }
}
