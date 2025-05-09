﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Response.Workspace;
using server.Dtos.Response.Workspace.WorkspaceResponseDto2;
using server.Entities;
using server.Extensions;
using server.Interfaces;
using server.Models.Query;

namespace server.Services
{
    public class WorkspaceService : IWorkspaceService
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDBContext _dbContext;

        public WorkspaceService(
            IMapper mapper,
            ApplicationDBContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<WorkspaceResponseDto2?> GetWorkspaceResponseAsync(Guid id, WorkspaceQuery query)
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
                response.Logo = workspace.Logo?.Url;

            if (getAllFields || requestedFields.Contains("visibility"))
                response.Visibility = workspace.Visibility;

            // Handle Members field
            if (query.Members)
            {
                // Load workspacemembers
                var workspaceMembers = await _dbContext.WorkspaceMembers
                    .Include(wm => wm.AppUser)
                    .Where(wm => wm.WorkspaceId == workspace.Id)
                    .ToListAsync();

                var members = workspaceMembers
                    .Select(wm =>
                    {
                        return new MemberDto
                        {
                            Id = wm.AppUserId,
                            Email = wm.AppUser.Email,
                            Avatar = wm.AppUser.Avatar,
                            FullName = wm.AppUser.FullName,
                            MemberType = wm.Role
                        };
                    })
                    .ToList();

                response.Members = members;
            }

            // Handle BoardCounts field in response
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

            // Handle JoinRequests field in response
            if (query.JoinRequests)
            {
                var joinRequests = await _dbContext.JoinRequests
                    .Where(j => j.WorkspaceId == id)
                    .ToListAsync();

                response.JoinRequests = _mapper.Map<List<WorkspaceJoinRequestResponse>>(joinRequests);
            }

            return response;
        }
    }
}
