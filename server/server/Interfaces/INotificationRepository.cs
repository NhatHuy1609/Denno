using server.Enums;

namespace server.Interfaces
{
    public interface INotificationRepository
    {
        Task<bool> CreateNotificationAsync(EntityType entityType, Guid entityId, ActionType actionType, string actorId, List<string> userIdsToNotify);
    }
}
