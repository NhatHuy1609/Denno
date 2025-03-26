using server.Dtos.Response.Board;
using server.Enums;
using server.Dtos.Response.Card;
using server.Dtos.Response.Workspace;

namespace server.Dtos.Response.Notification
{
    public class NotificationResponseDto
    {
        public string Id { get; set; }
        public bool IsRead { get; set; }
        public ActionType Type { get; set; }
        public string Date { get; set; }
        public string Data { get; set; }
        public string ActorId { get; set; }
        public WorkspaceResponseDto Workspace { get; set; }
        public CardResponseDto? Card { get; set; } = null;
        public BoardResponseDto? Board { get; set; } = null;
    }
}
