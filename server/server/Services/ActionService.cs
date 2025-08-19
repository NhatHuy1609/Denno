using server.Constants;
using server.Data;
using server.Entities;
using server.Interfaces;
using server.Strategies.ActionStrategy;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Services
{
    public class ActionService : IActionService
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly ILogger<ActionService> _logger;

        public ActionService(
            ApplicationDBContext dbContext,
            ILogger<ActionService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<DennoAction> CreateActionAsync(string actionType, DennoActionContext context)
        {
            if (string.IsNullOrEmpty(actionType))
                throw new ArgumentNullException("Action type cannot be null or empty", nameof(actionType));

            if (context == null)
                throw new ArgumentNullException(nameof(context), "Action context cannot be null");

            var strategy = GetActionStrategy(actionType);
            if (strategy == null)
                throw new InvalidOperationException($"No strategy found for action type: {actionType}");

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var action = await strategy.Execute(context);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return action;
                }
                catch (Exception ex) 
                {
                    _logger.LogError($"Failed to create action {ex.Message}");
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        private IDennoActionStrategy GetActionStrategy(string actionType)
        {
            return actionType switch
            {
                ActionTypes.AddMemberToWorkspace => new AddWorkspaceMemberStrategy(_dbContext),
                ActionTypes.JoinWorkspaceByLink => new JoinWorkspaceByLinkStrategy(_dbContext),
                ActionTypes.ApproveWorkspaceJoinRequest => new ApproveWorkspaceJoinRequestStrategy(_dbContext),
                ActionTypes.RejectWorkspaceJoinRequest => new RejectWorkspaceJoinRequestStrategy(_dbContext),
                ActionTypes.SendWorkspaceJoinRequest => new SendWorkspaceJoinRequestStrategy(_dbContext),
                ActionTypes.AddMemberToBoard => new AddBoardMemberStrategy(_dbContext),
                ActionTypes.CreateBoard => new CreateBoardStategy(_dbContext),
                ActionTypes.JoinBoard => new JoinBoardStrategy(_dbContext),
                ActionTypes.JoinBoardByLink => new JoinBoardByLinkStrategy(_dbContext),
                ActionTypes.SendBoardJoinRequest => new SendBoardJoinRequestStrategy(_dbContext),
                ActionTypes.ApproveBoardJoinRequest => new ApproveBoardJoinRequestStrategy(_dbContext),
                ActionTypes.RejectBoardJoinRequest => new RejectBoardJoinRequestStrategy(_dbContext),
                ActionTypes.UpdateBoardMemberRole => new UpdateBoardMemberRoleStrategy(_dbContext),
                ActionTypes.RemoveBoardMember => new RemoveBoardMemberStrategy(_dbContext),
                ActionTypes.UpdateWorkspaceMemberRole => new UpdateWorkspaceMemberRoleStrategy(_dbContext),
                _ => throw new ArgumentException($"Unsupported action type: {actionType}")
            };
        }
    }
}
