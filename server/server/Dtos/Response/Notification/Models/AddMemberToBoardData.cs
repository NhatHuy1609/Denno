namespace server.Dtos.Response.Notification.Models
{
    public class AddMemberToBoardData
    {
        public Guid BoardId { get; set; }
        public string AddedMemberId { get; set; }
        public string MemberCreatorId { get; set; }
    }
}
