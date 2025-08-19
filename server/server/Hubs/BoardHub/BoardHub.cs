using Microsoft.AspNetCore.SignalR;
using server.Helpers;
using server.Interfaces;
using server.Services.Realtime;
using System.Security.Claims;

namespace server.Hubs.BoardHub
{
    public class BoardHub : Hub<IBoardHubClient>
    {
        private readonly IBoardService _boardService;
        private readonly IConnectionManager _connectionManagerService;
        private readonly ILogger<BoardHub> _logger;

        public BoardHub(
            IBoardService boardService,
            IConnectionManager connectionManagerService,
            ILogger<BoardHub> logger)
        {
            _boardService = boardService;
            _connectionManagerService = connectionManagerService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId)) 
            {
                await _connectionManagerService.AddConnectionAsync(userId, HubType.Board, Context.ConnectionId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await _connectionManagerService.RemoveConnectionAsync(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinBoard(Guid boardId)
        {
            try
            {
                var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var canJoin = await _boardService.IsBoardMemberAsync(boardId, userId);

                if (!canJoin)
                {
                    await Clients.Caller.Error("You don't have permission to join this board");
                    return;
                }

                // Add current connection to team group
                await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroupNames.GetBoardGroupName(boardId));

                // Add All user's connections to team group (If user has multiple tabs/devices)
                var userConnections = await _connectionManagerService.GetUserConnectionsAsync(userId);
                foreach (var connection in userConnections.Where(conn => conn.ConnectionId != Context.ConnectionId))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, SignalRGroupNames.GetBoardGroupName(boardId));
                }

                await Clients.Caller.Success($"Successfully joined board {boardId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error joining board {boardId}", boardId);
                await Clients.Caller.Error($"Failed to join board");
            }
        }
    }
}
