using server.Dtos.Response.Notification;
using server.Entities;

namespace server.Factories.NotificationResponseFactory
{
    public interface INotificationResponseFactory
    {
        Task<NotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification);
    }
}
