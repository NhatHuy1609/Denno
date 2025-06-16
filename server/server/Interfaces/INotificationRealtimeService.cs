using server.Entities;

namespace server.Interfaces
{
    public interface INotificationRealtimeService
    {
        Task SendActionNotificationToUsersAsync(DennoAction action);
    }
}
