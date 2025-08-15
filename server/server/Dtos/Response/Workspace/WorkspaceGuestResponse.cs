using server.Dtos.Response.Board;
using server.Dtos.Response.Users;

namespace server.Dtos.Response.Workspace
{
    public class WorkspaceGuestResponse
    {
        public GetUserResponseDto User { get; set; }
        public IList<BoardResponseDto> JoinedBoards { get; set; }
    }
}
