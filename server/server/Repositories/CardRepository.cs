using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class CardRepository : GenericRepository<Card, Guid>, ICardRepository
    {
        public CardRepository(ApplicationDBContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Card>> GetCardsByCardListIdAsync(Guid cardListId)
        {
            var cards = await _context.Cards.Where(c => c.CardListId == cardListId).ToListAsync();
            return cards;
        }
    }
}
