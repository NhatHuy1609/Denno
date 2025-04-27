using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;

namespace server.Dtos.Response.InvitationSecret
{
    public class DetailedWorkspaceInvitationSecretResponse
    {
        public GetUserResponseDto Inviter { get; set; }
        public WorkspaceResponseDto Workspace { get; set; }
    }
}
