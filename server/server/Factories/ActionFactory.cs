using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Strategies.ActionStrategy;

namespace server.Factories
{
    public class ActionFactory
    {
        private readonly ApplicationDBContext _dbContext;

        public ActionFactory(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IDennoActionStrategy CreateStrategy(string actionType)
        {
            return actionType switch
            {
                ActionTypes.AddMemberToWorkspace => new AddWorkspaceMemberStrategy(_dbContext),
                _ => throw new ArgumentException($"Unsupported action type: {actionType}")
            };
        }
    }
}
