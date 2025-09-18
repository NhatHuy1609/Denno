using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Interfaces;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;
using server.UnitOfWorks;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class JoinBoardByLinkStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IUnitOfWork _unitOfWork;

        public JoinBoardByLinkStrategy(
            ApplicationDBContext dbContext,
            IUnitOfWork unitOfWork)
        {
            _dbContext = dbContext;
            _unitOfWork = unitOfWork;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.JoinBoardByLink;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(context.MemberCreatorId, "MemberCreatorId is required");

            if (context.BoardId == null || context.BoardId == Guid.Empty)
            {
                throw new ArgumentException("BoardId is required");
            }

            var boardId = context.BoardId.Value;
            var memberId = context.MemberCreatorId;

            var board = await _dbContext.Boards
                .Include(b => b.BoardMembers)
                .FirstOrDefaultAsync(b => b.Id == boardId);

            var action = new DennoAction
            {
                MemberCreatorId = memberId,
                ActionType = ActionTypes.JoinBoardByLink,
                BoardId = boardId,
                Date = DateTime.Now,
                IsBoardActivity = context.IsBoardActivity
            };

            var newMember = new BoardMember
            {
                BoardId = boardId,
                AppUserId = memberId
            };

            var notification = new Notification
            {
                Date = DateTime.Now,
                Action = action
            };

            // Notify all members in the board if they are watching the board
            var boardMembersWatching = await _unitOfWork.Boards.GetWatchingMembersByBoardIdAsync(boardId);
            var notificationRecipients = boardMembersWatching
                .Select(bm => new NotificationRecipient()
                {
                    Notification = notification,
                    RecipientId = bm.AppUserId
                });

            // Delete board join requests related to the user who joined the board
            var joinRequest = await _dbContext.JoinRequests
                .FirstOrDefaultAsync(j => j.BoardId == boardId && j.RequesterId == memberId);

            var isWorkspaceMemberBefore = await _dbContext.WorkspaceMembers
                .AnyAsync(wm => wm.AppUserId == memberId && wm.WorkspaceId == board.WorkspaceId);

            // Execure data modifications
            if (!isWorkspaceMemberBefore)
            {
                _dbContext.WorkspaceMembers.Add(new WorkspaceMember()
                {
                    WorkspaceId = board.WorkspaceId,
                    AppUserId = memberId,
                    Role = WorkspaceMemberRole.Guest
                });
            }

            if (joinRequest != null)
                _dbContext.JoinRequests.Remove(joinRequest);

            _dbContext.BoardMembers.Add(newMember);
            _dbContext.Actions.Add(action);
            _dbContext.Notifications.Add(notification);
            _dbContext.NotificationRecipients.AddRange(notificationRecipients);

            action.MemberCreator = await _dbContext.Users.FindAsync(memberId);

            return action;
        }
    }
}
