using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Factories.NotificationResponseFactory;
using server.Hubs.NotificationHub;
using server.Interfaces;
using server.Services.QueueHostedService;

namespace server.Services.Realtime
{
    public class NotificationRealtimeService : INotificationRealtimeService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<NotificationHub, INotificationHubClient> _hubContext;
        private readonly NotificationResponseFactoryResolver _notificationResponseFactoryResolver;
        private readonly IBackgroundTaskQueue _taskQueue;

        public NotificationRealtimeService(
            ApplicationDBContext dbContext,
            IHubContext<NotificationHub, INotificationHubClient> hubContext,
            NotificationResponseFactoryResolver notificationResponseFactoryResolver,
            IBackgroundTaskQueue taskQueue)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
            _notificationResponseFactoryResolver = notificationResponseFactoryResolver;
            _taskQueue = taskQueue;
        }

        public async Task SendActionNotificationToUsersAsync(DennoAction action)
        {
            var notification = await _dbContext.Notifications
                .Include(n => n.NotificationRecipients)
                .FirstOrDefaultAsync(n => n.ActionId == action.Id);

            var recipientIds = notification?.NotificationRecipients
                .Select(nr => nr.RecipientId)
                .ToList();

            var recipients = notification?.NotificationRecipients;

            if (recipients != null && recipientIds != null && recipients.Count > 0)
            {
                var responseResolver = _notificationResponseFactoryResolver.GetNotificationFactory(action.ActionType);
                var notificationResponse = await responseResolver.CreateNotificationResponse(recipients[0]);

                await _hubContext.Clients.Users(recipientIds).ReceiveActionNotification(notificationResponse);
            }
        }
    }
}
