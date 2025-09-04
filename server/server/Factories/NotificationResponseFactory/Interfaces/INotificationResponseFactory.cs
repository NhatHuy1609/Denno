using server.Dtos.Response.Notification.Interfaces;
using server.Entities;

namespace server.Factories.NotificationResponseFactory.Interfaces
{
    public interface INotificationResponseFactory
    {
        bool CanHandle(string actionType);
        Task<INotificationResponseDto> CreateNotificationResponse(NotificationRecipient notification);
    }
}
