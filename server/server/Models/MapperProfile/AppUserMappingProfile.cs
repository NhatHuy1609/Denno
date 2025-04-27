using AutoMapper;
using server.Dtos.Response.Users;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class AppUserMappingProfile: Profile
    {
        public AppUserMappingProfile()
        {
            CreateMap<AppUser, GetUserResponseDto>();
        }
    }
}
