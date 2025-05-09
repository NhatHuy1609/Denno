﻿using AutoMapper;
using server.Dtos.Response.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class WorkspaceMappingProfile: Profile
    {
        public WorkspaceMappingProfile()
        {
            CreateMap<Workspace, WorkspaceResponseDto>()
                .ForMember(dest => dest.LogoUrl, opt => opt.MapFrom(src => src.Logo.Url));
        }
    }
}
