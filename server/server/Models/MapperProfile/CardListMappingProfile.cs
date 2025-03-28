
using AutoMapper;
using server.Dtos.Response.CardList;
using server.Entities;

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
