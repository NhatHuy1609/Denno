namespace server.Hubs.WorkspaceHub
{
    public interface IWorkspaceHubClient : IBaseHubClient
    {
        Task OnWorkspaceMemberRoleChanged();
    }
}
