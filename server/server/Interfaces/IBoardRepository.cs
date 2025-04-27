using server.Entities;

namespace server.Interfaces;

public interface IBoardRepository: IGenericRepository<Board, Guid>
{
    Task<IEnumerable<Board>> GetBoardsByWorkspaceIdAsync(Guid workspaceId);
}