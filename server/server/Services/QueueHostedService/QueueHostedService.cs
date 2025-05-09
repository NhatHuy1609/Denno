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
            _logger.LogInformation("Queue Hosted Service is starting");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                    // Create a new scope for each work item
                    using (var scope = _services.CreateScope())
                    {
                        try
                        {
                            // Pass the scope's ServiceProvider to the work item
                            await workItem(stoppingToken, scope.ServiceProvider);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error occurred executing the work item");
                        }
                    } // The scope is disposed here, after the work item completes
                }
                catch (OperationCanceledException)
                {
                    // Expected when the token is canceled
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while waiting for work item");

                    // Prevent tight loops if something goes wrong
                    await Task.Delay(1000, stoppingToken);
                }
            }

            _logger.LogInformation("Queue Hosted Service is stopping");
        }
    }
}
