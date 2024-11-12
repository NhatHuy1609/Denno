using server.Entities;
using server.Models;

namespace server.Interfaces
{
    public interface IFileUploadRepository: IGenericRepository<FileUpload, int>
    {
        bool RemoveExistingWorkspaceLogoAsync(Workspace workspace);
    }
}
