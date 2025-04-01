using AutoMapper;
using server.Dtos.Requests.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class WorkspaceMemberProfile: Profile
    {
        public WorkspaceMemberProfile()
        {
            CreateMap<AddWorkspaceMemberRequestDto, WorkspaceMember>();
        }
    }
}
