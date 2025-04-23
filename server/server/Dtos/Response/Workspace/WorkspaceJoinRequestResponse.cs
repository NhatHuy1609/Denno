namespace server.Dtos.Response.Workspace
{
    public class WorkspaceJoinRequestResponse
    {
        public int Id { get; set; }
        public Requester Requester { get; set; }
        public DateTime RequestedAt { get; set; }
    }

    public class Requester
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
