using server.Entities;

namespace server.Dtos.Requests.Board
{
    public class ApproveBoardJoinRequestRequest
    {
        public BoardMemberRole MemberRole { get; set; }
    }
}
