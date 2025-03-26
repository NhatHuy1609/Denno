using server.Constants;
using server.Data;
using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public class AddWorkspaceMemberStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dBContext;

        public AddWorkspaceMemberStrategy(ApplicationDBContext dBContext)
        {
            _dBContext = dBContext;
        }

        public DennoAction Execute(DennoActionContext context)
        {
            var action = new DennoAction()
            {
                MemberCreatorId = context.MemberCreatorId,
                ActionType = ActionTypes.AddMemberToWorkspace,
                WorkspaceId = context.WorkspaceId,
                Date = DateTime.Now,
            };

            _dBContext.Actions.Add(action);

            return action;
        }
    }
}
