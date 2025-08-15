using server.Dtos.Response.Users;
using server.Entities;

namespace server.Dtos.Response.Board
{
    public class BoardMemberResponseDto
    {
        public string MemberId { get; set; }
        public GetUserResponseDto Member { get; set; }
        public BoardMemberRole BoardMemberRole { get; set; }
    }
}
