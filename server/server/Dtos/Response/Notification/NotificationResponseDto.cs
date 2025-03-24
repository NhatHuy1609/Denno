using server.Dtos.Response.Board;
using server.Enums;
using server.Entities;
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
        public WorkspaceResponseDto workspace { get; set; }
        public CardResponseDto? card { get; set; } = null;
        public BoardResponseDto? board { get; set; } = null;
    }
}
