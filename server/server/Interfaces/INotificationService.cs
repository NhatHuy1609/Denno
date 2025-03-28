using server.Entities;

namespace server.Interfaces
{
    public interface INotificationService
    {
        string? BuildActionNotificationMessage(DennoAction action);
    }
}
