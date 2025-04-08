using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Extensions;
using server.Interfaces;
using server.Models.Query;

namespace server.Services
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly ApplicationDBContext _dbContext;

        public WorkspaceService(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query)
        {
            var workspace = await _dbContext.Workspaces
                .FirstOrDefaultAsync(w => w.Id == id);

            if (workspace == null) return null;

            var response = new WorkspaceResponseDto2();

            // Handle Fields field
            var requestedFields = query.Fields.ParseFields();
            var getAllFields = requestedFields.Count() == 0;

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

            // Handle Members field
            if (query.Members)
            {
                // Load workspacemembers
                await _dbContext.Entry(workspace)
                        .Collection(w => w.WorkspaceMembers)
                        .LoadAsync();

                var members = workspace.WorkspaceMembers
                    .Select(workspaceMember =>
                    {
                         _dbContext.Entry(workspaceMember)
                            .Reference(wm => wm.AppUser)
                            .Load();

                        return new MemberDto
                        {
                            Id = workspaceMember.AppUserId,
                            Avatar = workspaceMember.AppUser.Avatar,
                            FullName = workspaceMember.AppUser.FullName,
                            MemberType = workspaceMember.Role
                        };
                    })
                    .ToList();

                foreach (var member in workspace.WorkspaceMembers)
                {
                    await _dbContext.Entry(member)
                        .Reference(m => m.AppUser)
                        .LoadAsync();
                }

                response.Members = members;
            }

            // Handle BoardCounts field
            if (query.BoardCounts)
            {
                var boardCounts = _dbContext.WorkspaceMembers
                    .Include(wm => wm.AppUser)
                    .ThenInclude(u => u.BoardMembers)
                    .Where(wm => wm.WorkspaceId == id)
                    .Select(wm => new BoardCountDto
                    {
                        IdMember = wm.AppUserId,
                        BoardCount = wm.AppUser.BoardMembers.Count
                    })
                    .ToList();

                response.BoardCounts = boardCounts;
            }

            return response;
        }
    }
}
