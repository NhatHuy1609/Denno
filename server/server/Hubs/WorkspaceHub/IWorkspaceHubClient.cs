namespace server.Hubs.WorkspaceHub
{
    public interface IWorkspaceHubClient : IBaseHubClient
    {
        Task OnWorkspaceMemberRoleChanged();
        Task OnWorkspaceMemberRemoved(string removedUserId, string actorUserId, Guid workspaceId, bool removeRelatedAccessibleBoards);
    }
}
