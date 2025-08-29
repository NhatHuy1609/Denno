namespace server.Dtos.Response.Notification.Models
{
    public class RemoveWorkspaceMemberData
    {
        public string MemberCreatorId { get; set; }
        public string RemovedMemberId { get; set; }
        public Guid WorkspaceId { get; set; }
    }
}
