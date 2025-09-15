using AutoMapper;
using server.Dtos.Response.Card;
using server.Entities;
using server.Helpers;

namespace server.Models.MapperProfile
{
    public class CardMappingProfile: Profile
    {
        public CardMappingProfile()
        {
            CreateMap<Card, CardResponseDto>()
                .ForMember(dest => dest.IsOverdue,
                            opt => opt.MapFrom(src => CardHelper.CalculateIsOverdue(src.CompleteDate, src.IsCompleted, src.DueDate)));
        }
    }
}
