using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class JoinWorkspaceByLinkNotificationResponse: NotificationResponseDto<JoinWorkspaceByLinkData, NotificationDisplay>
    {
        public JoinWorkspaceByLinkNotificationResponse()
        {
            this.Type = ActionTypes.JoinWorkspaceByLink;
        }
    }
}
