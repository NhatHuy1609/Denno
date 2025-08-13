using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;

namespace server.Interfaces
{
    public interface IBoardService
    {
        Task<bool> IsBoardMemberAsync(Guid boardId, string userId);
        Task<IEnumerable<IBoardActivityResponse>> GetBoardActivityResponsesAsync(Guid boardId);
        // Realtime
        Task NotifyMemberRoleChanged(Guid boardId);
    }
}
