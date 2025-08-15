using Microsoft.AspNetCore.Authorization;
using server.Authorization.Handlers;
using server.Authorization.Policies;

namespace server.Authorization.Extensions
{
    public static class AuthorizationServiceExtensions
    {
        public static IServiceCollection AddCustomAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddWorkspaceAuthorizationPolicies();
            });

            services.AddScoped<IAuthorizationHandler, WorkspaceMemberHandler>();
            services.AddScoped<IAuthorizationHandler, WorkspaceMemberViaBoardHandler>();

            return services;
        }
    }
}
