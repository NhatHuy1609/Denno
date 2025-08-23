using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dtos.Response.Board;
using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;
using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Extensions;
using server.Helpers;
using server.Hubs.WorkspaceHub;
using server.Interfaces;
using server.Models.Query;

namespace server.Services
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly ILogger<WorkspaceService> _logger;
        private readonly IMapper _mapper;
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<WorkspaceHub, IWorkspaceHubClient> _workspaceHubContext;

        public WorkspaceService(
            ILogger<WorkspaceService> logger,
            IMapper mapper,
            ApplicationDBContext dbContext,
            IHubContext<WorkspaceHub,IWorkspaceHubClient> workspaceHubContext)
        {
            _logger = logger;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _workspaceHubContext = workspaceHubContext;
        }

        public async Task<bool> IsWorkspaceMemberAsync(Guid workspaceId, string userId)
        {
            return await _dbContext.WorkspaceMembers
                .AnyAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == userId);
        }

        public async Task NotifyUserActionToWorkspaceMembers(DennoAction action, Guid workspaceId)
        {
            var clients = _workspaceHubContext
                .Clients
                .Groups(SignalRGroupNames.GetWorkspaceGroupName(workspaceId));

            switch (action.ActionType)
            {
                case ActionTypes.UpdateWorkspaceMemberRole:
                    await clients.OnWorkspaceMemberRoleChanged();
                    break;
                default:
                    break;
            }
        }

        public async Task<bool> LeaveWorkspaceAsync(Guid workspaceId, string userId)
        {
            var workspaceMember = await _dbContext.WorkspaceMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.AppUserId == userId);

            if (workspaceMember == null) 
            {
                _logger.LogError($"Can not workspaceMember with workspaceId:{workspaceId} - userId:{userId}");
                return false;
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.WorkspaceMembers.Remove(workspaceMember);
                _dbContext.WorkspaceGuests.Add(new WorkspaceGuest()
                {
                    GuestId = userId,
                    WorkspaceId = workspaceId
                });

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                _logger.LogInformation($"User:{userId} successfully leaved workspace");

            } catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                await transaction.RollbackAsync();
                return false;
            }

            return true;
        }

        public async Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query)
        {
            var workspace = await GetWorkspaceAsync(id);
            if (workspace == null)
            {
                return null;
            }

            var response = new WorkspaceResponseDto2();
            var requestedFields = query.Fields.ParseFields();
            var getAllFields = requestedFields.Count == 0;

            MapBasicFields(workspace, response, requestedFields.ToList(), getAllFields);
            await MapMembersAsync(workspace.Id, response, query.Members);
            await MapBoardCountsAsync(workspace.Id, response, query.BoardCounts);
            await MapJoinRequestsAsync(workspace.Id, response, query.JoinRequests);
            await MapGuestsAsync(workspace.Id, response, query.IncludeGuests);

            return response;
        }

        private async Task<Workspace?> GetWorkspaceAsync(Guid id)
        {
            return await _dbContext.Workspaces
                .Include(w => w.Logo)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        private void MapBasicFields(Workspace workspace, WorkspaceResponseDto2 response,
            IReadOnlyCollection<string> requestedFields, bool getAllFields)
        {
            if (getAllFields || requestedFields.Contains("id"))
                response.Id = workspace.Id;

            if (getAllFields || requestedFields.Contains("name"))
                response.Name = workspace.Name;

            if (getAllFields || requestedFields.Contains("description"))
                response.Description = workspace.Description;

            if (getAllFields || requestedFields.Contains("idowner"))
                response.IdOwner = workspace.OwnerId;

            if (getAllFields || requestedFields.Contains("logo"))
                response.Logo = workspace.Logo?.Url;

            if (getAllFields || requestedFields.Contains("visibility"))
                response.Visibility = workspace.Visibility;
        }

        private async Task MapMembersAsync(Guid workspaceId, WorkspaceResponseDto2 response, bool includeMembers)
        {
            if (!includeMembers)
                return;

            var workspaceMembers = await _dbContext.WorkspaceMembers
                .Include(wm => wm.AppUser)
                .Where(wm => wm.WorkspaceId == workspaceId)
                .ToListAsync();

            response.Members = workspaceMembers.Select(wm => new MemberDto
            {
                Id = wm.AppUserId,
                Email = wm.AppUser.Email,
                Avatar = wm.AppUser.Avatar,
                FullName = wm.AppUser.FullName,
                MemberType = wm.Role
            }).ToList();
        }

        private async Task MapBoardCountsAsync(Guid workspaceId, WorkspaceResponseDto2 response, bool includeBoardCounts)
        {
            if (!includeBoardCounts)
                return;

            response.BoardCounts = await _dbContext.WorkspaceMembers
                .Include(wm => wm.AppUser)
                .ThenInclude(u => u.BoardMembers)
                .Where(wm => wm.WorkspaceId == workspaceId)
                .Select(wm => new BoardCountDto
                {
                    IdMember = wm.AppUserId,
                    BoardCount = wm.AppUser.BoardMembers.Count
                })
                .ToListAsync();
        }

        private async Task MapJoinRequestsAsync(Guid workspaceId, WorkspaceResponseDto2 response, bool includeJoinRequests)
        {
            if (!includeJoinRequests)
                return;

            var joinRequests = await _dbContext.JoinRequests
                .Where(j => j.WorkspaceId == workspaceId)
                .ToListAsync();

            response.JoinRequests = _mapper.Map<List<WorkspaceJoinRequestResponse>>(joinRequests);
        }

        private async Task MapGuestsAsync(Guid workspaceId, WorkspaceResponseDto2 response, bool includeGuests)
        {
            if (!includeGuests)
                return;

            var workspaceGuests = await _dbContext.WorkspaceGuests
                .Include(wg => wg.Guest)
                .Where(wg => wg.WorkspaceId == workspaceId)
                .Select(wg => new
                {
                    Guest = wg.Guest,
                    JoinedBoards = _dbContext.BoardMembers
                        .Where(bm => bm.AppUserId == wg.GuestId && bm.Board.WorkspaceId == wg.WorkspaceId)
                        .Select(bm => bm.Board)
                        .ToList()
                })
                .ToListAsync();

            response.Guests = workspaceGuests
                .Select(wg => new WorkspaceGuestResponse() {
                    User = _mapper.Map<GetUserResponseDto>(wg.Guest),
                    JoinedBoards = _mapper.Map<List<BoardResponseDto>>(wg.JoinedBoards)
                })
                .ToList();
        }
    }
}