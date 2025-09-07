using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Helpers.LexoRank;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class AddCardStrategy: IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AddCardStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.CreateCard;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var createContext = context as CreateCardContext ??
                               throw new ArgumentException("Invalid context type for CreateCardContext");

            ArgumentException.ThrowIfNullOrWhiteSpace(createContext.MemberCreatorId);
            ArgumentException.ThrowIfNullOrWhiteSpace(createContext.CardName);
            ArgumentNullException.ThrowIfNull(createContext.ListId);

            var cardListId = createContext.ListId.Value;
            var newCardName = createContext.CardName;

            var newCard = new Card()
            {
                Name = newCardName,
                CardListId = cardListId
            };

            var cards = await _dbContext.Cards
                .Where(c => c.CardListId == cardListId)
                .ToListAsync();

            var lexorankGen = new LexoRankGenerator();

            if (cards.Count() == 0)
            {
                var newRank = lexorankGen.GenerateInitialRank();
                newCard.Rank = newRank;
            }
            else
            {
                var lastCard = cards.Last();
                var newRank = lexorankGen.GenerateNewRank(lastCard.Rank, null);
                newCard.Rank = newRank;
            }

            await _dbContext.Cards.AddAsync(newCard);

            // Create new action
            var action = new DennoAction()
            {
                MemberCreatorId = createContext.MemberCreatorId,
                ActionType = ActionTypes.CreateCard,
                IsBoardActivity = true,
                ListId = cardListId,
                Card = newCard,
                MetaData = JsonHelper.SerializeData(newCard)
            };

            _dbContext.Actions.Add(action);

            return action;
        }
    }
}
