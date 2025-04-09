using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Interfaces;
using server.Models.Query.UserWorkspacesQuery;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDBContext _dbContext;

        public UserService(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserWorkspaceResponse>?> GetUserWorkspacesResponse(string userId, UserWorkspacesQuery query)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null) return null;

            var workspaces = new List<Workspace>();

            // Handle Filter query field
            switch (query.Filter)
            {
                case FilterType.All:
                    var invitedWorkspaces = await _dbContext.WorkspaceMembers
                        .Include(wm => wm.Workspace)
                        .Where(wm => wm.AppUserId == userId)
                        .Select(wm => wm.Workspace)
                        .ToListAsync();

                    var ownedWorkspaces = await _dbContext.Workspaces
                        .Where(w => w.OwnerId == userId)
                        .ToListAsync();

                    workspaces.AddRange(invitedWorkspaces);
                    workspaces.AddRange(ownedWorkspaces);

                    break;
                default: // case FilterType.None will return an empty list of workspaces
                    break;
            }

            // Handle Fields query field
            var responses = new List<UserWorkspaceResponse>();
            if (workspaces.Count > 0)
            {
                foreach (var workspace in workspaces)
                {
                    var response = new UserWorkspaceResponse();

                    if (query.Fields.HasFlag(FieldsType.Id) || query.Fields.HasFlag(FieldsType.All))
                        response.Id = workspace.Id;
                    if (query.Fields.HasFlag(FieldsType.Name) || query.Fields.HasFlag(FieldsType.All))
                        response.Name = workspace.Name;
                    if (query.Fields.HasFlag(FieldsType.Logo) || query.Fields.HasFlag(FieldsType.All))
                        response.Logo = workspace.Logo?.Url;

                    responses.Add(response);
                }
            }

            return responses;
        }
    }
}
