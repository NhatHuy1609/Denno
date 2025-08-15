using server.Constants;
using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Notification.Models;

namespace server.Dtos.Response.Notification
{
    public class AddMemberToBoardNotificationResponseDto: NotificationResponseDto<AddMemberToBoardData, NotificationDisplay>
    {
        public AddMemberToBoardNotificationResponseDto()
        {
            Type = ActionTypes.AddMemberToBoard;
        }
    }
}
