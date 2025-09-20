using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Board;
using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;
using server.Entities;
using server.Interfaces;
using server.Models.Query;
using server.Models.Query.UserWorkspacesQuery;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDBContext _dbContext;

        public UserService(
            IMapper mapper,
            ApplicationDBContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<UserBoardsResponse> GetUserBoardsResponseAsync(string userId, UserBoardsQueryModel query)
        {
            var response = new UserBoardsResponse();

            await MapJoinedBoardsAsync(userId, response);
            await MapStarredBoardsAsync(userId, response, query.StarredBoards);

            return response;
        }

        public async Task MapJoinedBoardsAsync(string userId, UserBoardsResponse response)
        {
            var joinedBoards = await _dbContext.BoardMembers
                .Include(bm => bm.Board)
                .Where(bm => bm.AppUserId == userId)
                .Select(bm => bm.Board)
                .ToListAsync();

            response.Boards = _mapper.Map<List<BoardResponseDto>>(joinedBoards);
        }

        public async Task MapStarredBoardsAsync(string userId, UserBoardsResponse response, bool includeStarredBoards)
        {
            if (!includeStarredBoards) return;

            var starredBoards = await _dbContext.BoardMembers
                .Where(bm => bm.AppUserId == userId && bm.Board.StarredStatus == true)
                .Select(bm => bm.Board)
                .ToListAsync();

            response.StarredBoards = _mapper.Map<List<BoardResponseDto>>(starredBoards);
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
                    var joinedWorkspaces = await _dbContext.WorkspaceMembers
                        .Include(wm => wm.Workspace)
                        .ThenInclude(w => w.Logo)
                        .Where(wm => wm.AppUserId == userId)
                        .Select(wm => wm.Workspace)
                        .ToListAsync();

                    workspaces.AddRange(joinedWorkspaces);

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
