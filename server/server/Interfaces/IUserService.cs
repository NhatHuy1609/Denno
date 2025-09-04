using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;
using server.Models.Query;
using server.Models.Query.UserWorkspacesQuery;

namespace server.Interfaces
{
    public interface IUserService
    {
        Task<UserBoardsResponse> GetUserBoardsResponseAsync(string userId, UserBoardsQueryModel query);
        Task<List<UserWorkspaceResponse>?> GetUserWorkspacesResponse(string userId, UserWorkspacesQuery query);
    }
}
