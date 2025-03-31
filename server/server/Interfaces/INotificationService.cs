using server.Dtos.Response.Notification;
using server.Entities;

namespace server.Interfaces
{
    public interface INotificationService
    {
        string? BuildActionNotificationMessage(DennoAction action);
        Task<List<NotificationResponseDto>> GetUserNotificationResponseDtos(string userId);
    }
}
