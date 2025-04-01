namespace server.Dtos.Response.Notification.Models
{
    public class AddedToWorkspaceData
    {
        public Guid WorkspaceId { get; set; }
        public string AddedMemberId { get; set; }
        public string MemberCreatorId { get; set; }
    }
}
