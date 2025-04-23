namespace server.Dtos.Response.Notification.Models
{
    public class RejectWorkspaceRequestData
    {
        public Guid WorkspaceId { get; set; }
        public string MemberCreatorId { get; set; }
        public string RequesterId { get; set; }
    }
}
