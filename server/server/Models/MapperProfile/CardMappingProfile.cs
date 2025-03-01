using AutoMapper;
using server.Dtos.Response.Card;

namespace server.Models.MapperProfile
{
    public class CardMappingProfile: Profile
    {
        public CardMappingProfile()
        {
            CreateMap<Card, CardResponseDto>();
        }
    }
}
