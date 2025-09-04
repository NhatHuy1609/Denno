using server.Dtos.Response.Notification.Interfaces;
using server.Dtos.Response.Users;

namespace server.Dtos.Response.Notification.Bases
{
    public class NotificationResponseDto<TData, TDisplay>: INotificationResponseDto
    {
        public int Id { get; set; }
        public bool IsRead { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public DateTime? DateRead { get; set; }
        public string MemberCreatorId { get; set; }
        public Guid ActionId { get; set; }
        public GetUserResponseDto MemberCreator { get; set; }

        public TData Data { get; set; }
        public TDisplay Display { get; set; }
    }
}
