using server.Factories.BoardActivityResponseFactory.Interfaces;
using System.Reflection;

namespace server.Extensions
{
    public static class BoardActivityFactoryRegistrationExtensions
    {
        public static IServiceCollection AddBoardActivityResponseFactories(this IServiceCollection services, Assembly assembly)
        {
            var factoryType = typeof(IBoardActivityResponseFactory);

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
