namespace server.Dtos.Response.Notification.Models
{
    public class SendBoardJoinRequestData
    {
        public string RequesterId { get; set; }
        public Guid BoardId { get; set; }
        public bool IsWorkspaceMember { get; set; }
    }
}
