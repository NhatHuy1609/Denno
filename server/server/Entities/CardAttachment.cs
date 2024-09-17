namespace server.Models
{
    public class CardAttachment
    {
        public Guid Id { get; set; }
        public string FileLink { get; set; }
        public string FileName { get; set; }
        public DateTime UploadedDate { get; set; }

        public Guid CardId { get; set; }
        public Card Card { get; set; }
    }
}
