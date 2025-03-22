using Microsoft.EntityFrameworkCore.Storage;
using server.Data;
using server.Entities;
using server.Enums;
using server.Interfaces;

namespace server.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDBContext _context;

        public NotificationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateNotificationAsync(EntityType entityType, Guid entityId, ActionType actionType, string actorId, List<string> userIdsToNotify)
        {
            using (IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var notificationObject = new NotificationObject()
                    {
                        EntityType = entityType,
                        EntityId = entityId,
                        ActionType = actionType,
                        CreatedAt = DateTime.Now,
                    };
                    _context.NotificationObjects.Add(notificationObject);
                    await _context.SaveChangesAsync();

                    var notificationChange = new NotificationChange()
                    {
                        ActorId = actorId,
                        NotificationObjectId = notificationObject.Id,
                    };
                    _context.NotificationChanges.Add(notificationChange);
                    await _context.SaveChangesAsync();

                    foreach (var userId in userIdsToNotify)
                    {
                        var notification = new Notification()
                        {
                            NotificationObjectId = notificationObject.Id,
                            NotifierId = userId,
                            IsRead = false
                        };

                        _context.Notifications.Add(notification);
                    }
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    // Rollback if an error occurs
                    await transaction.RollbackAsync();
                    return false;
                }
            }
        }
    }
}
