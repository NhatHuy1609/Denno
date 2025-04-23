using server.Constants;
using server.Entities;
using server.Enums;

namespace server.Factories.NotificationResponseFactory
{
    public class NotificationResponseFactoryResolver
    {
        private readonly IServiceProvider _serviceProvider;

        public NotificationResponseFactoryResolver(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public INotificationResponseFactory GetNotificationFactory(string actionType)
        {
            // Assuming DennoAction has an ActionType property
            return actionType switch
            {
                ActionTypes.AddMemberToWorkspace => _serviceProvider.GetRequiredService<AddedMemberWorkspaceNotificationResponseFactory>(),
                ActionTypes.JoinWorkspaceByLink => _serviceProvider.GetRequiredService<JoinWorkspaceWithLinkNotificationResponseFactory>(),
                ActionTypes.ApproveWorkspaceJoinRequest => _serviceProvider.GetRequiredService<ApproveWorkspaceJoinRequestNotificationResponseFactory>(),
                ActionTypes.RejectWorkspaceJoinRequest => _serviceProvider.GetRequiredService<RejectWorkspaceJoinRequestNotificationResponseFactory>(),
                // Add more action types as needed
                _ => throw new ArgumentException($"No factory found for action type: {actionType}")
            };
        }
    }
}
