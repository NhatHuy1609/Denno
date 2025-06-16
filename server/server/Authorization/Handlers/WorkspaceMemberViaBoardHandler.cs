using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using server.Authorization.Requirements;
using server.Data;
using server.Entities;
using System.Security.Claims;

namespace server.Authorization.Handlers
{
    public class WorkspaceMemberViaBoardHandler : AuthorizationHandler<WorkspaceMemberRequirement>
    {
        private readonly ApplicationDBContext _dbContext;

        public WorkspaceMemberViaBoardHandler(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, WorkspaceMemberRequirement requirement)
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

            // Try to find the board ID in the route values
            var possibleKeys = new[] { "boardId", "id" };
            var boardId = possibleKeys
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

            if (boardId == null)
                return;

            // Check if the user is a member of the workspace associated with the board
            var isMember = await _dbContext.Boards
                .Where(b => b.Id == boardId.Value)
                .Join(_dbContext.WorkspaceMembers,
                        board => board.WorkspaceId,
                        workspaceMember => workspaceMember.WorkspaceId,
                        (board, workspaceMember) => workspaceMember)
                .AnyAsync(workspaceMember => workspaceMember.AppUserId == userId);

            if (isMember)
            {
                context.Succeed(requirement);
            }
        }
    }
}
