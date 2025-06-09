using server.Constants;
using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class CreateBoardStategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public CreateBoardStategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            // Cast the context to CreateBoardActionContext
            var createContext = context as CreateBoardActionContext ??
                                throw new ArgumentException("Invalid context type for CreateBoardStrategy");

            // Take the board data from the context
            var boardData = createContext.BoardData;

            // Add the owner as the first member of the board
            boardData.BoardMembers = new List<BoardMember>()
            {
                new BoardMember()
                {
                    AppUserId = context.MemberCreatorId,
                    BoardId = boardData.Id,
                }
            };

            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                BoardId = context.BoardId,
                WorkspaceId = context.WorkspaceId,
                ActionType = ActionTypes.CreateBoard,
                IsBoardActivity = context.IsBoardActivity,
            };

            _dbContext.Boards.Add(boardData);
            _dbContext.Actions.Add(action);

            return action;
        }
    }
}
