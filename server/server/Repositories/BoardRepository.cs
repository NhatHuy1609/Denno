using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;

namespace server.Repositories;

public class BoardRepository: GenericRepository<Board, Guid>, IBoardRepository
{
    public BoardRepository(ApplicationDBContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Board>> GetBoardsByWorkspaceIdAsync(Guid workspaceId)
    {
        var boards = await _context.Boards
            .Where(b => b.WorkspaceId == workspaceId)
            .ToListAsync();

        return boards;
    }
}