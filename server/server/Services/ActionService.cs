using server.Data;
using server.Entities;
using server.Factories;
using server.Interfaces;
using server.Strategies.ActionStrategy;

namespace server.Services
{
    public class ActionService : IActionService
    {
        private readonly ActionFactory _actionFactory;
        private readonly ApplicationDBContext _dbContext;
        private readonly ILogger<ActionService> _logger;

        public ActionService(
            ActionFactory actionFactory,
            ApplicationDBContext dbContext,
            ILogger<ActionService> logger)
        {
            _actionFactory = actionFactory;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<DennoAction> CreateActionAsync(string actionType, DennoActionContext context)
        {
            if (string.IsNullOrEmpty(actionType))
                throw new ArgumentNullException("Action type cannot be null or empty", nameof(actionType));

            if (context == null)
                throw new ArgumentNullException(nameof(context), "Action context cannot be null");

            var strategy = _actionFactory.CreateStrategy(actionType);
            if (strategy == null)
                throw new InvalidOperationException($"No strategy found for action type: {actionType}");

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var action = strategy.Execute(context);
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
    }
}
