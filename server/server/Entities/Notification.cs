namespace server.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }

        public Guid ActionId { get; set; }
        public DennoAction Action { get; set; }
    }
}
