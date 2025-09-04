namespace server.Strategies.ActionStrategy.Contexts
{
    public class RemoveWorkspaceMemberActionContext: DennoActionContext
    {
        public bool DeleteRelatedBoardMembers { get; set; } = false;
    }
}
