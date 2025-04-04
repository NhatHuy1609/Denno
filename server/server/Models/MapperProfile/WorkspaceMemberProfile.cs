using AutoMapper;
using server.Dtos.Requests.Workspace;
using server.Dtos.Response.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class WorkspaceMemberProfile: Profile
    {
        public WorkspaceMemberProfile()
        {
            CreateMap<AddWorkspaceMemberRequestDto, WorkspaceMember>();
            CreateMap<WorkspaceMember, WorkspaceMemberResponseDto>()
                .ForMember(dest => dest.MemberId, opt => opt.MapFrom(src => src.AppUserId))
                .ForMember(dest => dest.Member, opt => opt.MapFrom(src => src.AppUser));
        }
    }
}
