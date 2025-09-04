using server.Constants;

namespace server.Dtos.Response.Notification.Models
{
    public class RemoveWorkspaceGuestData
    {
        public string MemberCreatorId { get; set; }
        public string RemovedGuestId { get; set; }
        public Guid WorkspaceId { get; set; }
    }
}
