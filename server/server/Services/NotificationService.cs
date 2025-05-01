using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Notification.Interfaces;
using server.Entities;
using server.Factories.NotificationResponseFactory;
using server.Interfaces;

namespace server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly NotificationResponseFactoryResolver _notificationResponseFactoryResolver;

        public NotificationService(
            ApplicationDBContext dbContext,
            NotificationResponseFactoryResolver notificationResponseFactoryResolver)
        {
            _dbContext = dbContext;
            _notificationResponseFactoryResolver = notificationResponseFactoryResolver;
        }

        public async Task<List<INotificationResponseDto>> GetUserNotificationResponseDtos(string userId)
        {
            var responses = new List<INotificationResponseDto>();

            if (string.IsNullOrEmpty(userId))
                throw new ArgumentNullException(nameof(userId), "User ID cannot be null or empty");

            var userNotifications = _dbContext.NotificationRecipients
                .Include(n => n.Notification)
                .ThenInclude(n => n.Action)
                .Where(n => n.RecipientId == userId)
                .OrderByDescending(n => n.Notification.Date)
                .ToList();

            if (userNotifications == null || !userNotifications.Any())
            {
                return responses; // Return empty list if no notifications found
            }

            foreach (var notification in userNotifications)
            {
                var factory = _notificationResponseFactoryResolver.GetNotificationFactory(notification.Notification.Action.ActionType);
                var response = await factory.CreateNotificationResponse(notification);
                responses.Add(response);
            }

            return responses;
        }
    }
}
