namespace server.Dtos.Response.Notification.Models
{
    public class RemoveBoardMemberData
    {
        public string MemberCreatorId { get; set; }
        public string RemovedMemberId { get; set; }
        public Guid BoardId { get; set; }
    }
}
