using server.Models;

namespace server.Entities
{
    public class FileUpload
    {
        public int Id { get; set; }
        public string AssetId { get; set; }
        public string PublicId { get; set; }
        public string Url { get; set; }
        public string SecureUrl { get; set; }
        public string Format { get; set; }
        public string ResourceType { get; set; }
        public string CreatedAt { get; set; }

        public Guid WorkspaceId { get; set; }
        public Workspace Workspace { get; set; }
    }
}
