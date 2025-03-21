﻿using AutoMapper;
using server.Dtos.Requests.WorkspaceMember;

namespace server.Models.MapperProfile
{
    public class WorkspaceMemberProfile: Profile
    {
        public WorkspaceMemberProfile()
        {
            CreateMap<AddWorkspaceMemberRequestDto, WorkspaceMember>()
                .ForMember(dest => dest.AppUserId, opt => opt.MapFrom(src => src.UserId));
        }
    }
}
