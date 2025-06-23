using AutoMapper;
using server.Dtos.Response.Board;
using server.Dtos.Response.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class JoinRequestMappingProfile: Profile
    {
        public JoinRequestMappingProfile()
        {
            CreateMap<JoinRequest, WorkspaceJoinRequestResponse>()
                .ForMember(dest => dest.Requester, opt => opt.MapFrom(src => new Dtos.Response.Board.Requester
                {
                    Id = src.Requester.Id,
                    Name = src.Requester.FullName,
                    Email = src.Requester.Email,
                    Avatar = src.Requester.Avatar
                }))
                .ForMember(dest => dest.RequestedAt, opt => opt.MapFrom(src => src.CreatedAt));

            CreateMap<JoinRequest, BoardJoinRequestResponse>()
                .ForMember(dest => dest.Requester, opt => opt.MapFrom(src => new Dtos.Response.Board.Requester
                {
                    Id = src.Requester.Id,
                    Name = src.Requester.FullName,
                    Email = src.Requester.Email,
                    Avatar = src.Requester.Avatar
                }))
                .ForMember(dest => dest.RequestedAt, opt => opt.MapFrom(src => src.CreatedAt));
        }
    }
}
