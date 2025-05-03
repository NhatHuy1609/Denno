using server.Dtos.Response.Notification.Interfaces;

namespace server.Hubs.NotificationHub
{
    public interface INotificationHubClient
    {
        Task ReceiveActionNotification(INotificationResponseDto notificationResponse);
    }
}
