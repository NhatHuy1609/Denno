using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Serilog;
using server.Authorization.Extensions;
using server.Exceptions;
using server.Extensions;
using server.Factories.BoardActivityResponseFactory.Helpers;
using server.Factories.NotificationResponseFactory.Helper;
using server.Infrastructure;
using server.Infrastructure.Configurations;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.Converters.Add(new StringEnumConverter());
}); ;

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.Configure<FrontendUrlsConfiguration>(builder.Configuration.GetSection("FrontendUrls"));
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.Configure<GoogleAuthConfiguration>(builder.Configuration.GetSection("Authentication:Google"));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddApplicationServices(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddApplicationIdentity();
builder.Services.AddApplicationJwtAuth(builder.Configuration.GetSection("Jwt").Get<JwtConfiguration>());
builder.Services.AddApplicationApiVersioning();

// Add http client for external services
builder.Services.AddHttpContextAccessor();

// Add custom factories and strategies
builder.Services.AddActionStrategies(Assembly.GetExecutingAssembly());
builder.Services.AddBoardActivityResponseFactories(Assembly.GetExecutingAssembly());
builder.Services.AddNotificationResponseFactories(Assembly.GetExecutingAssembly());
builder.Services.AddScoped<BoardActivityResponseFactoryResolver>();
builder.Services.AddScoped<NotificationResponseFactoryResolver>();

// Configure Serilog
builder.Host.UseSerilog((context, loggerConfiguration) =>
{
    loggerConfiguration.WriteTo.Console();
    loggerConfiguration.ReadFrom.Configuration(context.Configuration);
});

// Configure global exception handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SignalR
builder.Services.AddSignalR().AddNewtonsoftJsonProtocol(options =>
{
    options.PayloadSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
});

// Add custom authorization policies
builder.Services.AddCustomAuthorization();

var app = builder.Build();

app.UseRouting();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    //.WithOrigins("https://localhost:3000")
    .SetIsOriginAllowed(origin => true)
);

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.UseHubs();

app.MapControllers();

app.UseExceptionHandler();

app.UseSerilogRequestLogging();

app.Run();
