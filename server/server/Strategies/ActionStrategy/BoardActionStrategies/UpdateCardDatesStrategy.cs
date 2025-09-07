using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class UpdateCardDatesStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public UpdateCardDatesStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.UpdateCardDates;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var updateContext = context as UpdateCardDatesContext ??
                                        throw new ArgumentException("Invalid context type for UpdateCardDatesContext");

            ArgumentNullException.ThrowIfNull(context.CardId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);

            var updatedCardId = context.CardId;
            var memberCreatorId = context.MemberCreatorId;

            var updatedCard = await _dbContext.Cards.FindAsync(updatedCardId);
            ArgumentNullException.ThrowIfNull(updatedCard);

            if (!string.IsNullOrEmpty(updateContext.StartDate))
            {
                updatedCard.StartDate = DateOnly.Parse(updateContext.StartDate);
            }

            if (!string.IsNullOrEmpty(updateContext.DueDate))
            {
                updatedCard.DueDate = DateTime.Parse(updateContext.DueDate);
            }

            var action = new DennoAction()
            {
                ActionType = ActionTypes.UpdateCardDates,
                MemberCreatorId = memberCreatorId,
                CardId = updatedCardId,
                MetaData = JsonHelper.SerializeData<UpdateCardDatesContext>(updateContext)
            };

            _dbContext.Cards.Update(updatedCard);
            await _dbContext.Actions.AddAsync(action);

            return action;
        }
    }
}
