using Microsoft.AspNetCore.Authorization;
using server.Authorization.Constants;
using server.Authorization.Requirements;

namespace server.Authorization.Policies
{
    public static class WorkspaceAuthorizationPolicies
    {
        public static void AddWorkspaceAuthorizationPolicies(this AuthorizationOptions options)
        {
            options.AddPolicy(PolicyNames.WorkspaceMember, policy =>
            {
                policy.Requirements.Add(new WorkspaceMemberRequirement());
            });

            options.AddPolicy(PolicyNames.WorkspaceMemberViaBoard, policy =>
            {
                policy.Requirements.Add(new WorkspaceMemberRequirement());
            });
        }
    }
}
