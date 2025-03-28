using server.Data;
using server.Entities;
using server.Interfaces;

namespace server.Repositories
{
    public class FileUploadRepository : GenericRepository<FileUpload, int>, IFileUploadRepository
    {
        public FileUploadRepository(ApplicationDBContext context) : base(context)
        {
        }

        public bool RemoveExistingWorkspaceLogoAsync(Workspace workspace)
        {
            var oldLogo = workspace.Logo;

            if (oldLogo == null) return false;

            _context.Remove(oldLogo);
            _context.SaveChanges();

            return true;
        }
    }
}
