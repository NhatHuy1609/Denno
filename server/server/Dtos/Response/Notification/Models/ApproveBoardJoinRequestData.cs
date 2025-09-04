namespace server.Dtos.Response.Notification.Models
{
    public class ApproveBoardJoinRequestData
    {
        public string MemberCreatorId { get; set; }
        public string AddedMemberId { get; set; }
        public Guid BoardId { get; set; }
    }
}
