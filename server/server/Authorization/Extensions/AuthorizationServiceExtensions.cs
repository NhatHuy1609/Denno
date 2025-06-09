using Microsoft.AspNetCore.Authorization;

namespace server.Authorization.Extensions
{
    public static class AuthorizationServiceExtensions
    {
        public static IServiceCollection AddCustomAuthorization(this IServiceCollection services)
        {
            return services;
        }
    }
}
