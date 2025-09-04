using server.Enums;

namespace server.Dtos.Requests.Board
{
    public class UpdateBoardRequest
    {
        public string Name { get; set; } = string.Empty;
        public BoardVisibility? Visibility { get; set; }
    }
}
