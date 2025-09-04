using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;
using server.Models.Query;

namespace server.Repositories;

public class BoardRepository : GenericRepository<Board, Guid>, IBoardRepository
{
    public BoardRepository(ApplicationDBContext context) : base(context)
    {
    }

    public async Task<Board?> GetBoardByIdAsync(Guid boardId, BoardQueryOptions options)
    {
        var query = _context.Boards.AsQueryable();

        if (options.IncludeBoardMembers)
        {
            query = query.Include(b => b.BoardMembers)
                        .ThenInclude(b => b.AppUser);
        }

        if (options.IncludeCardLists)
            query = query.Include(b => b.CardLists);

        if (options.IncludeBoardLabels)
            query = query.Include(b => b.BoardLabels);

        if (options.IncludeBoardRestrictions)
            query = query.Include(b => b.BoardRestrictions);

        if (options.IncludeActions)
            query = query.Include(b => b.Actions);

        if (options.IncludeJoinRequests)
            query = query.Include(b => b.JoinRequests)
                         .ThenInclude(jq => jq.Requester);

        if (options.IncludeBoardUserSettings)
            query = query.Include(b => b.BoardUserSettings);

        if (options.IncludeWorkspace)
            query = query.Include(b => b.Workspace);

        return await query.FirstOrDefaultAsync(b => b.Id == boardId);
    }

    public async Task<IEnumerable<Board>> GetBoardsByWorkspaceIdAsync(Guid workspaceId)
    {
        var boards = await _context.Boards
            .Where(b => b.WorkspaceId == workspaceId)
            .ToListAsync();

        return boards;
    }

    public async Task<List<BoardMember>> GetWatchingMembersByBoardIdAsync(Guid boardId)
    {
        var watchingMembers = await _context.BoardMembers
               .Where(bm => bm.BoardId == boardId)
               .Join(
                       _context.BoardUserSettings.Where(bu => bu.BoardId == boardId && bu.IsWatching),
                       bm => new { bm.BoardId, UserId = bm.AppUserId },
                       bu => new { bu.BoardId, bu.UserId },
                       (bm, bu) => bm
               )
               .ToListAsync();

        return watchingMembers;
    }
}