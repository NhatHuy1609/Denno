using server.Entities;

namespace server.Interfaces
{
    public interface IFileUploadRepository: IGenericRepository<FileUpload, int>
    {
        bool RemoveExistingWorkspaceLogoAsync(Workspace workspace);
    }
}
