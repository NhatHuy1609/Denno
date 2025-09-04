using server.Entities;
using server.Models.Query;

namespace server.Interfaces;

public interface IBoardRepository: IGenericRepository<Board, Guid>
{
    Task<List<BoardMember>> GetWatchingMembersByBoardIdAsync(Guid boardId);
    Task<Board?> GetBoardByIdAsync(Guid boardId, BoardQueryOptions options);
    Task<IEnumerable<Board>> GetBoardsByWorkspaceIdAsync(Guid workspaceId);
}