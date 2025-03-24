using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Enums;
using server.Interfaces;

namespace server.Services
{
    public class NotificationService: INotificationService
    {
        private readonly ApplicationDBContext _context;
        private readonly Dictionary<ActionType, string> _actionTypeMap;

        public NotificationService(ApplicationDBContext context)
        {
            _context = context;
            _actionTypeMap = new Dictionary<ActionType, string>()
            {
                { ActionType.Created, "added a" },
                { ActionType.Updated, "updated the" },
                { ActionType.Deleted, "deleted the" },
                { ActionType.Invited, "invited you to their"},
                { ActionType.Assigned, "assigned you to the" },
                { ActionType.Mentioned, "mentioned you in the" },
                { ActionType.Commented, "commented on the" },
                { ActionType.Moved, "moved the" },
                { ActionType.DueSoon, "reminded you about the" },
                { ActionType.Overdue, "flagged the overdue" }
            };
        }

        public async Task<(string Message, bool IsSuccess)> GenerateNotificationMessage(int notificationObjectId)
        {
            var notificationWithChange = await _context.NotificationObjects
                .Include(n => n.NotificationChanges)
                .FirstOrDefaultAsync(n => n.Id == notificationObjectId);

            if (notificationWithChange == null) 
            {
                return ("Notification object not found for ID: " + notificationObjectId, false);
            }

            var change = notificationWithChange.NotificationChanges.FirstOrDefault();
            if (change == null)
            {
                return ("No changes found for notification ID: " + notificationObjectId, false);
            }

            string actorName = await GetActorName(change.ActorId);
            if (string.IsNullOrEmpty(actorName))
            {
                return ("Actor not found for ID: " + change.ActorId, false);
            }

            string actionMessage = GetActionMessage(notificationWithChange.ActionType);

            var entityDetails = await GetEntityDetails(
                    notificationWithChange.EntityType,
                    notificationWithChange.EntityId);

            if (entityDetails == null)
            {
                return ($"Entity details not found for type {notificationWithChange.EntityType} and ID {notificationWithChange.EntityId}", false);
            }

            var message = GenerateMessageFromTemplate(
                notificationWithChange.EntityType,
                notificationWithChange.ActionType,
                actorName,
                actionMessage,
                entityDetails);

            if (string.IsNullOrEmpty(message))
            {
                return ("Failed to generate message from template", false);
            }

            return (message, true);
        }

        private string GenerateMessageFromTemplate(EntityType entityType, ActionType actionType, string actorName, string actionMessage, dynamic entityDetails)
        {
            string entityName = entityDetails?.Name ?? "Unknown";
            return (entityType, actionType) switch
            {
                (EntityType.Workspace, ActionType.Invited) => $"{actorName} has {actionMessage} Workspace {entityName}",
                _ => string.Empty
            };
        }

        private async Task<dynamic?> GetEntityDetails(EntityType entityType, Guid entityId)
        {
            switch (entityType)
            {
                case EntityType.Workspace:
                    var workspace = await _context.Workspaces.FindAsync(entityId);
                    return workspace != null ? new { Name = workspace.Name } : null;
                default:
                    return null;
            }
        }

        private async Task<string> GetActorName(string actorId)
        {
            var user = await _context.Users.FindAsync(actorId);
            return user?.UserName ?? string.Empty;
        }

        private string GetActionMessage(ActionType actionType)
        {
            return _actionTypeMap.TryGetValue(actionType, out var actionMessage)
                ? actionMessage
                : "interacted with the";
        }
    }
}
