namespace server.Dtos.Response.Notification.Interfaces
{
    public interface INotificationResponseDto
    {
        int Id { get; set; }
        bool IsRead { get; set; }
        string Type { get; set; }
        DateTime Date { get; set; }
        DateTime? DateRead { get; set; }
        string MemberCreatorId { get; set; }
        Guid ActionId { get; set; }
    }
}
