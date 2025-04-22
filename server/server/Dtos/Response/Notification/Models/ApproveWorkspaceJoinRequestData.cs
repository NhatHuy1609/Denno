namespace server.Dtos.Response.Notification.Models
{
    public class ApproveWorkspaceJoinRequestData
    {
        public Guid WorkspaceId { get; set; }
        public string RequesterId { get; set; }
        public string MemberCreatorId { get; set; }
    }
}
