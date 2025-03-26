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

        public ActionService(ActionFactory actionFactory, ApplicationDBContext dbContext)
        {
            _actionFactory = actionFactory;
            _dbContext = dbContext;
        }

        public async Task<DennoAction> CreateActionAsync(string actionType, ActionContext context)
        {
            var strategy = _actionFactory.CreateStrategy(actionType);
            var action = strategy.Execute(context);
            await _dbContext.SaveChangesAsync();
            return action;
        }
    }
}
