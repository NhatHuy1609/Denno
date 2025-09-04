using server.Factories.NotificationResponseFactory.Interfaces;
using System.Reflection;

namespace server.Extensions
{
    public static class NotificationResponseFactoryRegistrationExtensions
    {
        public static IServiceCollection AddNotificationResponseFactories(this IServiceCollection services, Assembly assembly) 
        {
            var factoryType = typeof(INotificationResponseFactory);

            var implementations = assembly
                .GetTypes()
                .Where(type =>
                    !type.IsAbstract &&
                    !type.IsInterface &&
                    factoryType.IsAssignableFrom(type));

            foreach (var impl in implementations) 
            {
                services.AddScoped(factoryType, impl);
            }

            return services;
        }
    }
}
