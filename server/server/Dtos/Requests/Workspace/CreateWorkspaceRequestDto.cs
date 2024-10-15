namespace server.Dtos.Requests.Workspace
{
    public class CreateWorkspaceRequestDto
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}
