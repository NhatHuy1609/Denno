namespace server.Hubs.WorkspaceHub
{
    public interface IWorkspaceHubClient : IBaseHubClient
    {
        Task OnWorkspaceMemberRoleChanged();
        Task OnWorkspaceMemberLeft(string userId, Guid workspaceId);
        Task OnWorkspaceMemberRemoved(string removedUserId, string actorUserId, Guid workspaceId, bool removeRelatedAccessibleBoards);
    }
}
