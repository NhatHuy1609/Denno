using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;

namespace server.Factories.BoardActivityResponseFactory.Interfaces
{
    public interface IBoardActivityResponseFactory
    {
        bool CanHandle(string actionType);
        Task<IBoardActivityResponse> CreateBoardActivityResponseAsync(Guid boardActionId);
    }
}
