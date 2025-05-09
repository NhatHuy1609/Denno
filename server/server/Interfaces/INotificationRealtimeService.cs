using server.Entities;

namespace server.Interfaces
{
    public interface INotificationRealtimeService
    {
        void SendActionNotificationToUsersInBackground(DennoAction action);
        Task SendActionNotificationToUsersAsync(DennoAction action);
    }
}
