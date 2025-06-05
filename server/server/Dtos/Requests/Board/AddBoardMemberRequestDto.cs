using server.Entities;

namespace server.Dtos.Requests.Board
{
    public class AddBoardMemberRequestDto
    {
        public string Email { get; set; }
        public string Description { get; set; } = string.Empty;
        public BoardMemberRole Role { get; set; } = BoardMemberRole.Member;
    }
}
