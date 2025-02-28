using server.Entities;

namespace server.Models
{
    public class FileUploadResult
    {
        public bool Success { get; set; }
        public string? Url { get; set; }
        public string ErrorMessage { get; set; }
        public FileUpload FileUpload { get; set; }
    }
}
