using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class AssignCardMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public AssignCardMemberStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.AssignCardMember;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.CardId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.TargetUserId);

            var memberCreatorId = context.MemberCreatorId;
            var assigneeId = context.TargetUserId;
            var cardId = context.CardId.Value;

            var card = await _dbContext.Cards
                .Include(c => c.CardList)
                .FirstOrDefaultAsync(c => c.Id == cardId);
            ArgumentNullException.ThrowIfNull(card);

            var boardId = card.CardList.BoardId;
            context.BoardId = boardId;

            var newMember = new CardMember()
            {
                CardId = cardId,
                AppUserId = assigneeId
            };

            var action = new DennoAction()
            {
                ActionType = ActionTypes.AssignCardMember,
                CardId = cardId,
                TargetUserId = assigneeId,
                MemberCreatorId = memberCreatorId,
                MetaData = JsonHelper.SerializeData<DennoActionContext>(context)
            };

            await _dbContext.CardMembers.AddAsync(newMember);
            await _dbContext.Actions.AddAsync(action);

            return action;
        }
    }
}
