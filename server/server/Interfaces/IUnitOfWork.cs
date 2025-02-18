namespace server.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IBoardRepository Boards { get; }
        IWorkspaceRepository Workspaces { get; }
        IFileUploadRepository FileUploads { get; }
        ICardListRepository CardLists { get; }
        int Complete();
    }
}
