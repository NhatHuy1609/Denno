using AutoMapper;
using server.Dtos.Response.InvitationSecret;
using server.Dtos.Response.Workspace;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class InvitationSecretProfile: Profile
    {
        public InvitationSecretProfile()
        {
            CreateMap<InvitationSecret, BoardInvitationSecretResponse>();
            CreateMap<InvitationSecret, WorkspaceInvitationSecretResponseDto>();
            CreateMap<InvitationSecret, DetailedWorkspaceInvitationSecretResponse>();
        }
    }
}
