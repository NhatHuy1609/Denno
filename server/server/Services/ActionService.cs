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
        private readonly IEnumerable<IDennoActionStrategy> _actionStrategies;

        public ActionService(
            ApplicationDBContext dbContext,
            ILogger<ActionService> logger,
            IEnumerable<IDennoActionStrategy> actionStrategies)
        {
            _dbContext = dbContext;
            _logger = logger;
            _actionStrategies = actionStrategies;
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
            var strategy = _actionStrategies.FirstOrDefault(s => s.CanHandle(actionType));

            if (strategy == null)
            {
                throw new ArgumentException(nameof(actionType), $"Can not find strategy for {actionType}");
            }

            return strategy;
        }
    }
}
