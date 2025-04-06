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

        public async Task<WorkspaceResponseDto2?> GetWorkspaceByIdAsync(Guid id, WorkspaceQuery query)
        {
            var workspace = await _dbContext.Workspaces
                .Include(w => w.Logo)
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
                response.Logo = workspace.Logo.Url;

            if (getAllFields || requestedFields.Contains("visibility"))
                response.Visibility = workspace.Visibility;

            // Handle BoardCounts field
            if (query.Members)
            {
                var members = workspace.WorkspaceMembers
                    .Select(wm => new MemberDto
                    {
                        Id = wm.AppUserId,
                        Avatar = wm.AppUser.Avatar,
                        FullName = wm.AppUser.FullName,
                        MemberType = wm.Role
                    })
                    .ToList();

                response.Members = members;
            }

            return response;
        }
    }
}
