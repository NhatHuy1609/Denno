namespace server.Services.QueueHostedService
{
    public class QueueHostedService : BackgroundService
    {
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly IServiceProvider _services;
        private readonly ILogger<QueueHostedService> _logger;

        public QueueHostedService(
            IBackgroundTaskQueue taskQueue,
            IServiceProvider services,
            ILogger<QueueHostedService> logger)
        {
            _taskQueue = taskQueue;
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested) 
            { 
                var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                try
                {
                    using var scope = _services.CreateScope();
                    await workItem(stoppingToken, scope.ServiceProvider);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to execute background task: {ex.Message}");
                }
            }
        }
    }
}
