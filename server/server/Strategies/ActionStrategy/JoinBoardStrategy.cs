using Org.BouncyCastle.Cms;
using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class JoinBoardStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public JoinBoardStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.BoardId);
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId);

            var boardId = context.BoardId.Value;
            var userId = context.MemberCreatorId;

            var newMember = new BoardMember()
            {
                BoardId = boardId,
                AppUserId = userId
            };

            var action = new DennoAction()
            {
                ActionType = ActionTypes.JoinBoard,
                MemberCreatorId = userId,
                BoardId = boardId,
                IsBoardActivity = context.IsBoardActivity,
            };

            _dbContext.Actions.Add(action);
            _dbContext.BoardMembers.Add(newMember);

            return action;
        }
    }
}
