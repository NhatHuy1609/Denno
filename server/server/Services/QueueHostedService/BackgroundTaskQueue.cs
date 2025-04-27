using System.Threading.Channels;

namespace server.Services.QueueHostedService
{
    public class BackgroundTaskQueue : IBackgroundTaskQueue
    {
        private readonly Channel<Func<CancellationToken, IServiceProvider, Task>> _queue =
            Channel.CreateUnbounded<Func<CancellationToken, IServiceProvider, Task>>();

        public async Task<Func<CancellationToken, IServiceProvider, Task>> DequeueAsync(CancellationToken cancellationToken)
            => await _queue.Reader.ReadAsync(cancellationToken);

        public void QueueBackgroundWorkItem(Func<CancellationToken, IServiceProvider, Task> workItem)
            => _queue.Writer.TryWrite(workItem);
    }
}
