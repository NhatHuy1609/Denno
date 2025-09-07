using AutoMapper;
using server.Dtos.Response.Card;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class CardMappingProfile: Profile
    {
        public CardMappingProfile()
        {
            CreateMap<Card, CardResponseDto>()
                .ForMember(dest => dest.IsOverdue,
                            opt => opt.MapFrom(src => 
                                src.DueDate.HasValue && src.DueDate.Value < DateTime.UtcNow));
        }
    }
}
