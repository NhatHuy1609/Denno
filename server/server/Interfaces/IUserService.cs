using server.Dtos.Response.Workspace;
using server.Models.Query.UserWorkspacesQuery;

namespace server.Interfaces
{
    public interface IUserService
    {
        Task<List<UserWorkspaceResponse>?> GetUserWorkspacesResponse(string userId, UserWorkspacesQuery query);
    }
}
