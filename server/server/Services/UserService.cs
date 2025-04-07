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
                    // Loaded user's owned workspaces
                    await _dbContext.Entry(user)
                            .Collection(u => u.OwnedWorkspaces)
                            .LoadAsync();

                    // Loaded user's invited workspaces
                    await _dbContext.Entry(user)
                            .Collection(u => u.WorkspaceMembers)
                            .LoadAsync();

                    var invitedWorkspaces = user.WorkspaceMembers.Select(wm => wm.Workspace);
                    var ownedWorkspaces = user.OwnedWorkspaces;

                    workspaces.AddRange(invitedWorkspaces);
                    workspaces.AddRange(ownedWorkspaces);

                    break;
                default: // case FilterType.None will return an empty list of workspaces
                    break;
            }

            // Handle Fields query field
            List<UserWorkspaceResponse> responses = workspaces.Select(w =>
            {
                var response = new UserWorkspaceResponse();
                if (query.Fields.HasFlag(FieldsType.Id) || query.Fields.HasFlag(FieldsType.All))
                    response.Id = w.Id;
                if (query.Fields.HasFlag(FieldsType.Name) || query.Fields.HasFlag(FieldsType.All))
                    response.Name = w.Name;
                if (query.Fields.HasFlag(FieldsType.Logo) || query.Fields.HasFlag(FieldsType.All))
                    response.Logo = w.Logo?.Url;

                return response;
            }).ToList();

            return responses;
        }
    }
}
