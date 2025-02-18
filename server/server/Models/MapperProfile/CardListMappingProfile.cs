
using AutoMapper;
using server.Dtos.Response.CardList;

namespace server.Models.MapperProfile
{
    public class CardListMappingProfile: Profile
    {
        public CardListMappingProfile()
        {
            CreateMap<CardList, CardListResponseDto>();
        }
    }
}
