using server.Dtos.Response.Notification.Interfaces;
using server.Entities;

namespace server.Factories.NotificationResponseFactory
{
    public interface INotificationResponseFactory
    {
        Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification);
    }
}
