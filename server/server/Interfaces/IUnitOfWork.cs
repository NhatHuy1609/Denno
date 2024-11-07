namespace server.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IBoardRepository Boards { get; }
        IWorkspaceRepository Workspaces { get; }
        int Complete();
    }
}
