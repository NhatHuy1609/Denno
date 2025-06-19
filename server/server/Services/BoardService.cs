using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Factories.BoardActivityResponseFactory.Helpers;
using server.Interfaces;

namespace server.Services
{
    public class BoardService : IBoardService
    {
        private readonly BoardActivityResponseFactoryResolver _boardActivityResponseFactoryResolver;
        private readonly ApplicationDBContext _dbContext;

        public BoardService(
            BoardActivityResponseFactoryResolver boardActivityResponseFactoryResolver,
            ApplicationDBContext dbContext)
        {
            _boardActivityResponseFactoryResolver = boardActivityResponseFactoryResolver;
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<IBoardActivityResponse>> GetBoardActivityResponsesAsync(Guid boardId)
        {
            var boardActivities = await _dbContext.Actions
                .Where(b => b.IsBoardActivity && b.BoardId == boardId)
                .ToListAsync();

            var boardActivityResponses = new List<IBoardActivityResponse>();
            foreach (var boardActivity in boardActivities)
            {
                var factory = _boardActivityResponseFactoryResolver.GetFactory(boardActivity.ActionType);
                var response = await factory.CreateBoardActivityResponseAsync(boardActivity.Id);
                boardActivityResponses.Add(response);
            }

            return boardActivityResponses;
        }

        public async Task<bool> IsBoardMemberAsync(Guid boardId, string userId)
        {
            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            if (board == null)
            {
                return false;
            }

            return board.BoardMembers.Any(bm => bm.AppUserId == userId);
        }
    }
}
