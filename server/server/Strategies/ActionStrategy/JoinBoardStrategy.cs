using Microsoft.EntityFrameworkCore;
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

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.JoinBoard;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentNullException.ThrowIfNull(context.BoardId);
            ArgumentNullException.ThrowIfNull(context.MemberCreatorId);

            var boardId = context.BoardId.Value;
            var userId = context.MemberCreatorId;

            // Verify that the user requesting to join the board is already a member of the workspace
            var board = await _dbContext.Boards.FindAsync(boardId);
            if (board is null)
                throw new InvalidOperationException($"Board {boardId} not found.");

            var isWorkspaceMember = await _dbContext.WorkspaceMembers
                .AnyAsync(wm => wm.WorkspaceId == board.WorkspaceId && wm.AppUserId == userId);

            // Create new board member
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
                IsBoardActivity = true
            };

            if (!isWorkspaceMember)
            {
                _dbContext.WorkspaceMembers.Add(new WorkspaceMember
                {
                    WorkspaceId = board.WorkspaceId,
                    AppUserId = userId,
                    Role = WorkspaceMemberRole.Guest
                });
            }

            _dbContext.Actions.Add(action);
            _dbContext.BoardMembers.Add(newMember);

            return action;
        }
    }
}
