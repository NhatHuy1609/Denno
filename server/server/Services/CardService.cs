using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Requests.Card;
using server.Entities;
using server.Interfaces;
using server.Models.Query;
using server.Models.Results;

namespace server.Services
{
    public class CardService : ICardService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly ILogger<CardService> _logger;

        public CardService(
            ApplicationDBContext dbContext,
            ILogger<CardService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<IList<CardMember>> GetCardMembersAsync(Guid cardId)
        {
            return await _dbContext.CardMembers
                .Include(cm => cm.AppUser)
                .Include(cm => cm.Card)
                .Where(cm => cm.CardId == cardId)
                .ToListAsync();
        }

        public async Task<Card?> GetDetailedCardAsync(Guid cardId, CardQueryModel query)
        {
            var cardQuery = _dbContext.Cards;

            if (query.IncludeCardList)
            {
                cardQuery.Include(c => c.CardList);
            }

            return await cardQuery.FirstOrDefaultAsync(c => c.Id == cardId);
        }

        public async Task<Result<bool>> MarkCardAsCompletedAsync(Guid cardId)
        {
            var card = await _dbContext.Cards.FindAsync(cardId);

            if (card == null)
            {
                return Result<bool>.Failure(Error.FromDescription($"card-{cardId} not found"));
            }

            card.IsCompleted = true;
            card.CompleteDate = DateTime.UtcNow;

            _dbContext.Cards.Update(card);

            await _dbContext.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> MarkCardAsInCompletedAsync(Guid cardId)
        {
            var card = await _dbContext.Cards.FindAsync(cardId);

            if (card == null)
            {
                return Result<bool>.Failure(Error.FromDescription($"card-{cardId} not found"));
            }

            card.IsCompleted = false;
            card.CompleteDate = null;

            _dbContext.Cards.Update(card);

            await _dbContext.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        public async Task<Card?> UpdateCardAsync(Guid cardId, UpdateCardRequest request)
        {
            var card = await _dbContext.Cards
                .Include(c => c.CardList)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                card.Name = request.Name;
            }

            await _dbContext.SaveChangesAsync();

            return card;
        }
    }
}
