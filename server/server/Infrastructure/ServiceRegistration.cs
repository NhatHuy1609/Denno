using Asp.Versioning;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using server.Data;
using server.Entities;
using server.Enums;
using server.Factories;
using server.Factories.NotificationResponseFactory;
using server.Hubs.BoardHub;
using server.Hubs.NotificationHub;
using server.Hubs.WorkspaceHub;
using server.Infrastructure.Configurations;
using server.Infrastructure.Providers;
using server.Interfaces;
using server.Repositories;
using server.Services;
using server.Services.Email;
using server.Services.QueueHostedService;
using server.Services.Realtime;
using server.UnitOfWorks;

namespace server.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, string? connectionStringConfigName) 
        {
            services.AddHttpClient<GoogleService>();
            services.AddScoped<IGoogleService, GoogleService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDataStore, EFGoogleDataStore>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IWorkspaceService, WorkspaceService>();
            services.AddScoped<IUserService, UserService>();
            #region Repositories
            services.AddTransient<IWorkspaceRepository, WorkspaceRepository>();
            #endregion
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IActionService, ActionService>();
            services.AddScoped<IBoardService, BoardService>();
            services.AddScoped<IConnectionManager, ConnectionManagerService>();

            services.AddDbContext<ApplicationDBContext>(options =>
            {
                options.UseSqlServer(connectionStringConfigName);
            });

            // Factories
            services.AddScoped<NotificationResponseFactoryResolver>();
            services.AddScoped<AddedMemberWorkspaceNotificationResponseFactory>();
            services.AddScoped<JoinWorkspaceWithLinkNotificationResponseFactory>();
            services.AddScoped<ApproveWorkspaceJoinRequestNotificationResponseFactory>();
            services.AddScoped<RejectWorkspaceJoinRequestNotificationResponseFactory>();
            services.AddScoped<SendWorkspaceJoinRequestNotificationResponseFactory>();
            services.AddScoped<AddMemberToBoardNotificationResponseFactory>();
            services.AddScoped<UpdateWorkspaceMemberRoleNotificationResponseFactory>();

            // Background services
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
            services.AddHostedService<QueueHostedService>();

            // Realtime services
            services.AddScoped<INotificationRealtimeService, NotificationRealtimeService>();

            return services;
        }

        public static IdentityBuilder AddApplicationIdentity(this IServiceCollection services)
        {
            return services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;

                // Password settings
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequiredUniqueChars = 0;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(60);

                // User settings
                options.User.RequireUniqueEmail = true;

                // Sign in settings
                options.SignIn.RequireConfirmedEmail = true;

                // Token provider settings
                options.Tokens.EmailConfirmationTokenProvider = "emailconfirmation";

            })
            .AddDefaultTokenProviders()
            .AddTokenProvider<EmailConfirmationTokenProvider<AppUser>>("emailconfirmation")
            .AddEntityFrameworkStores<ApplicationDBContext>();
        }

        public static IServiceCollection AddApplicationJwtAuth(this IServiceCollection services, JwtConfiguration configuration)
        {
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ClockSkew = TimeSpan.Zero,
                        ValidateActor = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        RequireExpirationTime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration.Issuer,
                        ValidAudience = configuration.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.Key))
                    };

                    options.Events = new JwtBearerEvents()
                    {
                        OnChallenge = context =>
                        {
                            context.HandleResponse();

                            context.Response.Headers.Add("Token-Expired", "true");
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";

                            var response = new
                            {
                                statusCode = ApiStatusCode.Unauthorized,
                                statusMessage = "ExpiredToken::Token has expired"
                            };

                            var json = JsonConvert.SerializeObject(response);
                            return context.Response.WriteAsync(json);
                        },

                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            // TODO just test empty token
                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            return services;
        }

        public static IServiceCollection AddApplicationApiVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new Asp.Versioning.ApiVersion(1, 0);
                options.ReportApiVersions = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new UrlSegmentApiVersionReader(),
                    new QueryStringApiVersionReader("api-version"),
                    new HeaderApiVersionReader("X-Version"),
                    new MediaTypeApiVersionReader("X-Version"));
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            return services;
        }

        public static IApplicationBuilder UseHubs(this IApplicationBuilder app)
        {
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<NotificationHub>("hubs/notification");
                endpoints.MapHub<BoardHub>("hubs/board");
                endpoints.MapHub<WorkspaceHub>("hubs/workspace");
            });

            return app;
        }
    }
}
