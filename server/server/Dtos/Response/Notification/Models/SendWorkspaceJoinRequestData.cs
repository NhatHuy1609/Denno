namespace server.Dtos.Response.Notification.Models
{
    public class SendWorkspaceJoinRequestData
    {
        public Guid WorkspaceId { get; set; }
        public string RequesterId { get; set; }
    }
}
