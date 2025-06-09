using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;

namespace server.Interfaces
{
    public interface IBoardService
    {
        Task<IEnumerable<IBoardActivityResponse>> GetBoardActivityResponsesAsync(Guid boardId);
    }
}
