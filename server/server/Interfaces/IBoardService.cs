using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Entities;
using server.Models.Query;
using server.Models.Results;

namespace server.Interfaces
{
    public interface IBoardService
    {
        Task<Result<bool>> StarBoardAsync(Guid boardId);
        Task<bool> IsBoardMemberAsync(Guid boardId, string userId);
        Task<Result<List<Board>>> GetJoinedBoardsAsync(string userId, UserJoinedBoardQueryModel query);
        Task<IEnumerable<IBoardActivityResponse>> GetBoardActivityResponsesAsync(Guid boardId);
        // Realtime
        Task NotifyMemberRoleChanged(Guid boardId);
    }
}
