using server.Dtos.Response.Notification;
using server.Dtos.Response.Notification.Interfaces;
using server.Entities;

namespace server.Interfaces
{
    public interface INotificationService
    {
        Task MarkNotificationAsReadAsync(int notificationId, string userId);
        Task MarkAllNotificationsAsReadAsync(string userId);
        Task<List<INotificationResponseDto>> GetUserNotificationResponseDtos(string userId);
    }
}
