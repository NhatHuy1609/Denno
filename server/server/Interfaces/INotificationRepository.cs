using server.Entities;
using server.Enums;

namespace server.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetNotificationsByUserIdAsync(string id);
        Task<(NotificationObject? NotificationObject, bool IsSuccess)> CreateNotificationAsync(EntityType entityType, Guid entityId, ActionType actionType, string actorId, List<string> userIdsToNotify);
    }
}
