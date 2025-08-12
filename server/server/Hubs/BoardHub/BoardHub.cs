using Microsoft.AspNetCore.SignalR;
using server.Interfaces;
using System.Security.Claims;

namespace server.Hubs.BoardHub
{
    public class BoardHub : Hub<IBoardHubClient>
    {
        private readonly IBoardService _boardService;

        public BoardHub(IBoardService boardService)
        {
            _boardService = boardService;
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

                await Groups.AddToGroupAsync(Context.ConnectionId, $"board_{boardId}");

                await Clients.Caller.Success($"Successfully joined board {boardId}");
            }
            catch (Exception ex)
            {
                await Clients.Caller.Error($"Failed to join board");
            }
        }
    }
}
