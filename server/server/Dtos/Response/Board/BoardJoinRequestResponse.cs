namespace server.Dtos.Response.Board
{
    public class BoardJoinRequestResponse
    {
        public int Id { get; set; }
        public Guid BoardId { get; set; }
        public Requester Requester { get; set; }
        public DateTime RequestedAt { get; set; }
    }

    public class Requester
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
    }
}
