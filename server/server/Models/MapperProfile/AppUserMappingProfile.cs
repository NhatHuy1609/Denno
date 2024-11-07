using AutoMapper;
using server.Dtos.Response.Users;

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
