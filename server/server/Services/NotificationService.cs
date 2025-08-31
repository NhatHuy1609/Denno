using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Notification.Interfaces;
using server.Entities;
using server.Factories.NotificationResponseFactory.Helper;
using server.Interfaces;

namespace server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IAuthService _authService;
        private readonly ApplicationDBContext _dbContext;
        private readonly NotificationResponseFactoryResolver _notificationResponseFactoryResolver;

        public NotificationService(
            ILogger<NotificationService> logger,
            IAuthService authService,
            ApplicationDBContext dbContext,
            NotificationResponseFactoryResolver notificationResponseFactoryResolver)
        {
            _logger = logger;
            _authService = authService;
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

        public async Task MarkNotificationAsReadAsync(int notificationId, string userId)
        {
            var recipient = await _dbContext.NotificationRecipients
                .FirstOrDefaultAsync(r => r.NotificationId == notificationId && r.RecipientId == userId);

            if (recipient == null)
            {
                _logger.LogError($"Can not find recipient with id-{userId} and notification-{notificationId}");
                return;
            }

            recipient.IsRead = true;
            recipient.DateRead = DateTime.Now;

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"Successfully mark notification-{notificationId} as read");
        }
        
        public async Task MarkAllNotificationsAsReadAsync(string userId)
        {
            var unreadNotifications = await _dbContext.NotificationRecipients
                .Where(r => r.RecipientId == userId)
                .ToListAsync();

            foreach (var  unreadNotification in unreadNotifications)
            {
                unreadNotification.IsRead = true;
                unreadNotification.DateRead = DateTime.Now;
            }

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"Successfully mark all notifications of user-{userId} as read");
        }
    }
}
