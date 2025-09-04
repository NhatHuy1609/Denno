using Microsoft.AspNetCore.SignalR;
using server.Helpers;
using server.Interfaces;
using server.Services.Realtime;
using System.Security.Claims;

namespace server.Hubs.WorkspaceHub
{
    public class WorkspaceHub : Hub<IWorkspaceHubClient>
    {
        private readonly IWorkspaceService _workspaceService;
        private readonly IConnectionManager _connectionManagerService;
        private readonly ILogger<WorkspaceHub> _logger;

        public WorkspaceHub(
            IWorkspaceService workspaceService,
            IConnectionManager connectionManagerService,
            ILogger<WorkspaceHub> logger)
        {
            _workspaceService = workspaceService;
            _connectionManagerService = connectionManagerService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await _connectionManagerService.AddConnectionAsync(userId, HubType.Workspace, Context.ConnectionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await _connectionManagerService.RemoveConnectionAsync(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinWorkspace(Guid workspaceId)
        {
            try
            {
                var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var canJoin = await _workspaceService.IsWorkspaceMemberAsync(workspaceId, userId);

                if (!canJoin)
                {
                    await Clients.Caller.Error("You don't have permission to join this workspace");
                    return;
                }

                // Add current connection to workspace group
                await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroupNames.GetWorkspaceGroupName(workspaceId));

                // Add all user's other connections to the same workspace group
                var userConnections = await _connectionManagerService.GetUserConnectionsAsync(userId);
                foreach (var connection in userConnections.Where(conn => conn.ConnectionId != Context.ConnectionId))
                {
                    await Groups.AddToGroupAsync(connection.ConnectionId, SignalRGroupNames.GetWorkspaceGroupName(workspaceId));
                }

                await Clients.Caller.Success($"Successfully joined workspace {workspaceId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error joining workspace {workspaceId}", workspaceId);
                await Clients.Caller.Error($"Failed to join workspace");
            }
        }
    }
}
