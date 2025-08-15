using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using server.Authorization.Requirements;
using server.Data;
using System.Security.Claims;

namespace server.Authorization.Handlers
{
    public class WorkspaceMemberHandler : AuthorizationHandler<WorkspaceMemberRequirement>
    {
        private readonly ApplicationDBContext _dbContext;

        public WorkspaceMemberHandler(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            WorkspaceMemberRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return; // User is not authenticated
            }

            var httpContext = context.Resource as HttpContext;
            if (httpContext == null)
            {
                return;
            }

            // Try to find the workspace ID in the route values
            var possibleKeys = new[] { "workspaceId", "id" };
            var workspaceId = possibleKeys
                .Select(key =>
                {
                    if (httpContext.Request.RouteValues.ContainsKey(key) &&
                        Guid.TryParse(httpContext.Request.RouteValues[key]?.ToString(), out var id))
                    {
                        return id;
                    }
                    return (Guid?)null;
                })
                .FirstOrDefault(id => id.HasValue);

            if (workspaceId == null)
            {
                return; // No workspace ID found in the route
            }

            // Check if the user is a member of the workspace
            var isMember = await _dbContext.WorkspaceMembers
                .AnyAsync(wm => wm.AppUserId == userId && wm.WorkspaceId == workspaceId);

            if (isMember)
            {
                context.Succeed(requirement);
            }
        }
    }
}
