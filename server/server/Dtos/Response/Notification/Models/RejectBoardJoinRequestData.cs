namespace server.Dtos.Response.Notification.Models
{
    public class RejectBoardJoinRequestData
    {
        public string MemberCreatorId { get; set; }
        public string RequesterId { get; set; }
        public Guid BoardId { get; set; }
    }
}
