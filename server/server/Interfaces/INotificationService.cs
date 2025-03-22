namespace server.Interfaces
{
    public interface INotificationService
    {
        Task<(string Message, bool IsSuccess)> GenerateNotificationMessage(int notificationObjectId);
    }
}
