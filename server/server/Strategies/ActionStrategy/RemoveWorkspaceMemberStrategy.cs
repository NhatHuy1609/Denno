using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Entities;
using server.Helpers;
using server.Models.DennoActionMetaData;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class RemoveWorkspaceMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public RemoveWorkspaceMemberStrategy(
            ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var removeContext = context as RemoveWorkspaceMemberActionContext ?? 
                                                        throw new ArgumentNullException(nameof(context));

            ArgumentNullException.ThrowIfNull(removeContext.WorkspaceId);
            ArgumentNullException.ThrowIfNullOrWhiteSpace(removeContext.MemberCreatorId);
            ArgumentNullException.ThrowIfNullOrWhiteSpace(removeContext.TargetUserId);

            var workspaceId = removeContext.WorkspaceId;
            var removedUserId = removeContext.TargetUserId;
            var memberCreatorId = removeContext.MemberCreatorId;
            var deleteRelatedBoardMembers = removeContext.DeleteRelatedBoardMembers;
            var relatedBoardMembers = new List<BoardMember>();

            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == removedUserId);

            ArgumentNullException.ThrowIfNull(workspaceMember);

            // Prepare related board members to delete from database if deleteRelatedBoardMembers is true
            if (deleteRelatedBoardMembers)
            {
                relatedBoardMembers = await (
                        from bm in _dbContext.BoardMembers
                        join b in _dbContext.Boards 
                            on bm.BoardId equals b.Id
                        where b.WorkspaceId == workspaceId && bm.AppUserId == removedUserId
                        select bm
                    )
                    .ToListAsync();
            }

            var action = new DennoAction()
            {
                MemberCreatorId = memberCreatorId,
                WorkspaceId = workspaceId,
                TargetUserId = removedUserId,
                ActionType = ActionTypes.RemoveWorkspaceMember,
                MetaData = JsonHelper.SerializeData(new RemoveWorkspaceMemberMetaData()
                {
                    DeleteRelatedBoardMembers = deleteRelatedBoardMembers
                })
            };

            _dbContext.Actions.Add(action);
            _dbContext.WorkspaceMembers.Remove(workspaceMember);
            _dbContext.RemoveRange(relatedBoardMembers);

            return action;
        }
    }
}
