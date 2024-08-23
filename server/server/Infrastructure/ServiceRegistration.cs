using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.Data;

namespace server.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, string? connectionStringConfigName) 
        {
            services.AddDbContext<ApplicationDBContext>(options =>
            {
                options.UseSqlServer(connectionStringConfigName);
            });

            return services;
        }
    }
}
