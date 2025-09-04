namespace server.Dtos.Response.Workspace
{
    public class RemoveWorkspaceMemberDto
    {
        public bool DeleteRelatedBoardMembers { get; set; } = false;
    }
}
