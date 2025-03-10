using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using System.Linq.Expressions;

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
                .Where(c => c.BoardId == boardId)
                .Include(c => c.Cards)
                .OrderBy(c => c.Rank)
                .ToListAsync();

            return cardLists;
        }
    }
}
