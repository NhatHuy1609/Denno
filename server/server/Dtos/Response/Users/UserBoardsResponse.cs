using server.Dtos.Response.Board;

namespace server.Dtos.Response.Users
{
    public class UserBoardsResponse
    {
        public List<BoardResponseDto> Boards { get; set; } = new();
        public List<BoardResponseDto> StarredBoards { get; set; } = new();
    }
}
