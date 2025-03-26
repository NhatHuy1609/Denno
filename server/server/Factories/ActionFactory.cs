using server.Constants;
using server.Data;
using server.Strategies.ActionStrategy;

namespace server.Factories
{
    public class ActionFactory
    {
        private readonly ApplicationDBContext _dBContext;

        public ActionFactory(ApplicationDBContext dBContext)
        {
            _dBContext = dBContext;
        }

        public IActionStategy CreateStrategy(string actionType)
        {
            return actionType switch
            {
                ActionTypes.AddMemberToWorkspace => new AddWorkspaceMemberStrategy(_dBContext),
                _ => throw new ArgumentException($"Unsupported action type: {actionType}")
            };
        }
    }
}
