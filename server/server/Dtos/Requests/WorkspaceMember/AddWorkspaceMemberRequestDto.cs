namespace server.Dtos.Requests.WorkspaceMember
{
    public class AddWorkspaceMemberRequestDto
    {
        public Guid WorkspaceId { get; set; }
        public string UserId { get; set; }
    }
}
