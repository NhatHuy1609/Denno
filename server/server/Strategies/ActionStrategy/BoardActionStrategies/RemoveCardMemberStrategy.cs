using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class RemoveCardMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveCardMemberStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.RemoveCardMember;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.CardId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentException.ThrowIfNullOrWhiteSpace(context.TargetUserId);

            var memberCreatorId = context.MemberCreatorId;
            var removedMemberId = context.TargetUserId;
            var cardId = context.CardId.Value;

            var removedMember = await _dbContext.CardMembers
                .FirstOrDefaultAsync(cm => cm.AppUserId == removedMemberId && cm.CardId == cardId);
            ArgumentNullException.ThrowIfNull(removedMember);

            var action = new DennoAction()
            {
                ActionType = ActionTypes.RemoveCardMember,
                MemberCreatorId = memberCreatorId,
                TargetUserId = removedMemberId,
                CardId = cardId
            };

            _dbContext.CardMembers.Remove(removedMember);
            await _dbContext.Actions.AddAsync(action);

            return action;
        }
    }
}
