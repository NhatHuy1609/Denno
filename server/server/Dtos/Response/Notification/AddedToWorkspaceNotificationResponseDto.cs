using server.Constants;
using server.Dtos.Response.Notification.Bases;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class AddedToWorkspaceNotificationResponseDto : NotificationResponseDto<AddedToWorkspaceData, NotificationDisplay>
    {
        public AddedToWorkspaceNotificationResponseDto()
        {
            Type = ActionTypes.AddMemberToWorkspace;
        }
    }
}
