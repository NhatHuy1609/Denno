using server.Strategies.ActionStrategy.Interfaces;
using System.Reflection;

namespace server.Extensions
{
    public static class ActionStrategyRegistrationExtensions
    {
        public static IServiceCollection AddActionStrategies(this IServiceCollection services, Assembly assembly)
        {
            var factoryType = typeof(IDennoActionStrategy);

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
