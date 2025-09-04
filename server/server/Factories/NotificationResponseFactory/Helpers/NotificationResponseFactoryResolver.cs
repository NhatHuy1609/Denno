using server.Factories.NotificationResponseFactory.Interfaces;

namespace server.Factories.NotificationResponseFactory.Helper
{
    public class NotificationResponseFactoryResolver
    {
        private readonly IEnumerable<INotificationResponseFactory> _factories;

        public NotificationResponseFactoryResolver(IEnumerable<INotificationResponseFactory> factories)
        {
            _factories = factories;
        }

        public INotificationResponseFactory GetNotificationFactory(string actionType)
        {
            var factory = _factories.FirstOrDefault(f => f.CanHandle(actionType));

            if (factory == null) 
            { 
                throw new ArgumentException($"No notification response factory found for action type: {actionType}");
            }

            return factory;
        }
    }
}
