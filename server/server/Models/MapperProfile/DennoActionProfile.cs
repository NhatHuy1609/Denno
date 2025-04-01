using AutoMapper;
using server.Dtos.Response.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class DennoActionProfile: Profile
    {
        public DennoActionProfile()
        {
            CreateMap<DennoAction, AddWorkspaceResponseDto>();
        }
    }
}
