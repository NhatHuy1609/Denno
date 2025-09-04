using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Factories.NotificationResponseFactory.Helper;
using server.Hubs.NotificationHub;
using server.Interfaces;
using server.Services.QueueHostedService;
using server.Services.QueueHostedService.Extensions;

namespace server.Services.Realtime
{
    public class NotificationRealtimeService : INotificationRealtimeService
    {
        private readonly ILogger<NotificationRealtimeService> _logger;
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<NotificationHub, INotificationHubClient> _hubContext;
        private readonly NotificationResponseFactoryResolver _notificationResponseFactoryResolver;
        private readonly IBackgroundTaskQueue _taskQueue;

        public NotificationRealtimeService(
            ILogger<NotificationRealtimeService> logger,
            ApplicationDBContext dbContext,
            IHubContext<NotificationHub, INotificationHubClient> hubContext,
            NotificationResponseFactoryResolver notificationResponseFactoryResolver,
            IBackgroundTaskQueue taskQueue)
        {
            _logger = logger;
            _dbContext = dbContext;
            _hubContext = hubContext;
            _notificationResponseFactoryResolver = notificationResponseFactoryResolver;
            _taskQueue = taskQueue;
        }

        public async Task SendActionNotificationToUsersAsync(DennoAction action, bool isRunInBackground = true)
        {
            ArgumentNullException.ThrowIfNull(nameof(action));

            if (isRunInBackground)
            {
                _taskQueue.EnqueueScopedWorkItem<NotificationRealtimeService>(async (service) =>
                {
                    await service.SendActionNotificationToUsersInternalAsync(action);
                    _logger.LogInformation("Queued action notification sending for action ID: {ActionId}", action.Id);
                });
            } else
            {
                await SendActionNotificationToUsersInternalAsync(action);
                _logger.LogInformation("Sent action notification  for action ID: {ActionId}", action.Id);
            }

            _logger.LogInformation("Successfully sent action notification for action ID: {ActionId}", action.Id);
        }

        private async Task SendActionNotificationToUsersInternalAsync(DennoAction action)
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
