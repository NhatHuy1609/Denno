using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class CardListRepository : GenericRepository<CardList, Guid>, ICardListRepository
    {
        public CardListRepository(ApplicationDBContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CardList>> GetCardListsByBoardIdAsync(Guid boardId)
        {
            var cardLists = await _context.CardLists
                .Where(cl => cl.BoardId == boardId)
                .Include(cl => cl.Cards.OrderBy(c => c.Rank))
                .ThenInclude(c => c.CardMembers)
                .OrderBy(cl => cl.Rank)
                .AsSplitQuery()
                .ToListAsync();

            return cardLists;
        }
    }
}
