using Microsoft.AspNetCore.Authorization;
using server.Authorization.Requirements;

namespace server.Authorization.Handlers
{
    public class WorkspaceMemberHandler : AuthorizationHandler<WorkspaceMemberRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, WorkspaceMemberRequirement requirement)
        {
            throw new NotImplementedException();
        }
    }
}
