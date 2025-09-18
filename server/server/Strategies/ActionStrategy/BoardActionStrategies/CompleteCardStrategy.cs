using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Interfaces;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class CompleteCardStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly ICardService _cardService;

        public CompleteCardStrategy(
            ApplicationDBContext dbContext,
            ICardService cardService)
        {
            _dbContext = dbContext;
            _cardService = cardService;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.CompleteCard;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.CardId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);

            var updatedCardid = context.CardId.Value;
            var memberCreatorId = context.MemberCreatorId;

            var updatedCard = await _dbContext.Cards
                .Include(c => c.CardList)
                .FirstOrDefaultAsync(c => c.Id == updatedCardid);
            ArgumentNullException.ThrowIfNull(updatedCard);

            // Update the action context
            context.BoardId = updatedCard?.CardList.BoardId;

            var updatedResult = await _cardService.MarkCardAsCompletedAsync(updatedCardid);

            if (updatedResult.IsFailure)
            {
                throw new Exception($"Failed to mark card-{updatedCardid} as completed");
            }

            var action = new DennoAction()
            {
                ActionType = ActionTypes.CompleteCard,
                IsBoardActivity = true,
                MemberCreatorId = memberCreatorId,
                CardId = updatedCardid,
                MetaData = JsonHelper.SerializeData<DennoActionContext>(context)
            };

            _dbContext.Cards.Update(updatedCard!);
            await _dbContext.Actions.AddAsync(action);

            return action;
        }
    }
}
