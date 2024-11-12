using CloudinaryDotNet.Actions;
using server.Models;

namespace server.Interfaces
{
    public interface IFileUploadService
    {
        Task<FileUploadResult> UploadPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
