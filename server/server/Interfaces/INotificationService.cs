using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Interfaces;
using server.Entities;

namespace server.Interfaces
{
    public interface INotificationService
    {
        string? BuildActionNotificationMessage(DennoAction action);
        Task<List<INotificationResponseDto>> GetUserNotificationResponseDtos(string userId);
    }
}
