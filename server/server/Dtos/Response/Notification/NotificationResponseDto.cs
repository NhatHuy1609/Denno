using server.Dtos.Response.Board;
using server.Dtos.Response.Card;
using server.Dtos.Response.Users;
using server.Dtos.Response.Workspace;

namespace server.Dtos.Response.Notification
{
    public abstract class NotificationResponseDto
    {
        public int Id { get; set; }
        public bool IsRead { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public DateTime? DateRead { get; set; }
        public string MemberCreatorId { get; set; }
        public Guid ActionId { get; set; }
        public GetUserResponseDto MemberCreator { get; set; }
    }
}
