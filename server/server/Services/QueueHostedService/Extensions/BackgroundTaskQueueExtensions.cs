namespace server.Services.QueueHostedService.Extensions
{
    public static class BackgroundTaskQueueExtensions
    {
        public static void EnqueueScopedWorkItem<TService>(
            this IBackgroundTaskQueue queue,
            Func<TService, Task> work)
            where TService : class
        {
            queue.QueueBackgroundWorkItem(async (cancellationToken, serviceProvider) =>
            {
                var service = serviceProvider.GetRequiredService<TService>();
                try
                {
                    await work(service);
                }
                catch (Exception ex)
                {
                    // Handle exceptions as needed, e.g., log them
                    var logger = serviceProvider.GetRequiredService<ILogger<TService>>();
                    logger.LogError(ex, "An error occurred while processing the background task.");
                }
            });
        }
    }
}
