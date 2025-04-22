namespace server.Dtos.Requests.Workspace
{
    public class CreateWorkspaceJoinRequest
    {
        public Guid WorkspaceId { get; set; }
        public string RequesterId { get; set; }
    }
}
