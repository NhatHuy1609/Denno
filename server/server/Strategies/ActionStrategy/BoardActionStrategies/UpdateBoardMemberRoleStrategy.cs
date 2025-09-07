using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using server.Constants;
using server.Data;
using server.Entities;
using server.Models.DennoActionMetaData;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy.BoardActionStrategies
{
    public class UpdateBoardMemberRoleStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public UpdateBoardMemberRoleStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool CanHandle(string actionType)
        {
            return actionType == ActionTypes.UpdateBoardMemberRole;
        }

        public async Task<DennoAction> Execute(DennoActionContext context)
        {
            var updateContext = context as UpdateBoardMemberRoleActionContext ?? 
                                            throw new ArgumentException("Invalid context type for UpdateBoardMemberRoleStrategy");

            ArgumentException.ThrowIfNullOrWhiteSpace(updateContext.MemberCreatorId);
            ArgumentNullException.ThrowIfNull(updateContext.BoardId);
            ArgumentNullException.ThrowIfNull(updateContext.TargetUserId);
            ArgumentNullException.ThrowIfNull(updateContext.TargetMemberRole);

            var boardMember = await _dbContext.BoardMembers
                .FirstOrDefaultAsync(
                    bm => bm.AppUserId == updateContext.TargetUserId &&
                    bm.BoardId == updateContext.BoardId);

            if (boardMember == null) 
                throw new ArgumentNullException(nameof(boardMember), $"Can not found board member with id-${context.TargetUserId} of boardId-{context.BoardId}");

            boardMember.Role = updateContext.TargetMemberRole;

            var action = new DennoAction()
            {
                MemberCreatorId = updateContext.MemberCreatorId,
                ActionType = ActionTypes.UpdateBoardMemberRole,
                BoardId = updateContext.BoardId,
                IsBoardActivity = true,
                TargetUserId = updateContext.TargetUserId,
                MetaData = JsonConvert.SerializeObject(new UpdateBoardMemberRoleMetaData()
                {
                    NewRole = updateContext.TargetMemberRole
                })
            };

            _dbContext.Update(boardMember);
            _dbContext.Actions.Add(action);

            return action;
        }
    }
}
