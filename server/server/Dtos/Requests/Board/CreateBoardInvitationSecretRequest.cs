using server.Entities;

namespace server.Dtos.Requests.Board
{
    public class CreateBoardInvitationSecretRequest
    {
        public BoardMemberRole BoardRole { get; set; }
    }
}
