using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Entities;
using server.Factories.BoardActivityResponseFactory.Helpers;
using server.Helpers;
using server.Hubs.BoardHub;
using server.Interfaces;
using server.Models.Query;
using server.Models.Results;

namespace server.Services
{
    public class BoardService : IBoardService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<BoardService> _logger;
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<BoardHub, IBoardHubClient> _hubContext;
        private readonly BoardActivityResponseFactoryResolver _boardActivityResponseFactoryResolver;

        public BoardService(
            ILogger<BoardService> logger,
            IMapper mapper,
            ApplicationDBContext dbContext,
            IHubContext<BoardHub, IBoardHubClient> hubContext,
            BoardActivityResponseFactoryResolver boardActivityResponseFactoryResolver)
        {
            _boardActivityResponseFactoryResolver = boardActivityResponseFactoryResolver;
            _hubContext = hubContext;
            _logger = logger;
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<Result<bool>> StarBoardAsync(Guid boardId)
        {
            var board = await _dbContext.Boards.FindAsync(boardId);

            if (board == null)
            {
                return Result<bool>.Failure(Error.FromDescription($"board-{boardId} not found"));
            }

            board.StarredStatus = true;
            _dbContext.Boards.Update(board);

            await _dbContext.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> UnstarBoardAsync(Guid boardId)
        {
            var board = await _dbContext.Boards.FindAsync(boardId);

            if (board == null)
            {
                return Result<bool>.Failure(Error.FromDescription($"board-{boardId} not found"));
            }

            board.StarredStatus = false;
            _dbContext.Boards.Update(board);

            await _dbContext.SaveChangesAsync();

            return Result<bool>.Success(true);
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

        public async Task<Result<List<Board>>> GetJoinedBoardsAsync(string userId, UserJoinedBoardQueryModel query)
        {
            var joinedBoardsQuery = _dbContext.BoardMembers
                .Include(bm => bm.Board)
                .Where(bm => bm.AppUserId == userId)
                .Select(bm => bm.Board);

            if (query.WorkspaceId != null)
            {
                joinedBoardsQuery = joinedBoardsQuery
                    .Where(jb => jb.WorkspaceId == query.WorkspaceId);
            }

            var joinedBoardsResult = await joinedBoardsQuery
                .Select(board => board)
                .ToListAsync();

            return Result<List<Board>>.Success(joinedBoardsResult);
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

        public async Task NotifyMemberRoleChanged(Guid boardId)
        {
            await _hubContext
                .Clients
                .Group(SignalRGroupNames.GetBoardGroupName(boardId))
                .ReceiveMemberRoleChanged();
        }
    }
}
