using AutoMapper;
using server.Dtos.Requests.Board;
using server.Dtos.Response.Board;

namespace server.Models.MapperProfile;

public class BoardMappingProfile: Profile
{
    public BoardMappingProfile()
    {
        CreateMap<CreateBoardRequestDto, Board>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.StarredStatus, opt => opt.MapFrom(src => src.StarredStatus))
            .ForMember((dest => dest.Visibility), opt => opt.MapFrom(src => src.Visibility))
            .ForMember(dest => dest.Background, opt => opt.MapFrom(src => src.Background))
            .ForMember(dest => dest.WorkspaceId, opt => opt.MapFrom(src => src.WorkspaceId));

        CreateMap<Board, BoardResponseDto>();
    }
}