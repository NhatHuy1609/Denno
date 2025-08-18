using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class RemoveBoardMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveBoardMemberStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId);
            ArgumentNullException.ThrowIfNull(context.BoardId);
            ArgumentNullException.ThrowIfNull(context.TargetUserId);

            // Execute remove member logic
            var boardMember = await _dbContext.BoardMembers
                .FirstOrDefaultAsync(bm => bm.AppUserId == context.TargetUserId && bm.BoardId == context.BoardId);

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.RemoveBoardMember,
                BoardId = context.BoardId,
                TargetUserId = context.TargetUserId,
                IsBoardActivity = context.IsBoardActivity
            };

            _dbContext.BoardMembers.Remove(boardMember);
            _dbContext.Actions.Add(action);

            return action;
        }
    }
}
