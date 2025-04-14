using AutoMapper;
using server.Dtos.Response.Action;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class DennoActionProfile: Profile
    {
        public DennoActionProfile()
        {
            CreateMap<DennoAction, AddWorkspaceMemberActionResponse>();
            CreateMap<DennoAction, JoinWorkspaceByLinkActionResponse>();
        }
    }
}
