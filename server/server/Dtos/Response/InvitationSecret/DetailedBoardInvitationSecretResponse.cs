using server.Dtos.Response.Board;
using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;

namespace server.Dtos.Response.InvitationSecret
{
    public class DetailedBoardInvitationSecretResponse
    {
        public GetUserResponseDto Inviter { get; set; }
        public BoardResponseDto Board { get; set; }
    }
}
