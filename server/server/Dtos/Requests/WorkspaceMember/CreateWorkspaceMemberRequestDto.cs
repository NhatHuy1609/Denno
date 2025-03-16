namespace server.Dtos.Requests.WorkspaceMember
{
    public class CreateWorkspaceMemberRequestDto
    {
        public Guid WorkspaceId { get; set; }
        public string UserId { get; set; }
    }
}
