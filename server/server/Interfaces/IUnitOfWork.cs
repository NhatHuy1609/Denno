namespace server.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IWorkspaceRepository Workspaces { get; }
        int Complete();
    }
}
