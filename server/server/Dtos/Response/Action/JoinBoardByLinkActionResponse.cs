namespace server.Dtos.Response.Action
{
    public class JoinBoardByLinkActionResponse : ActionResponse
    {
        public string BoardId { get; set; }
        public string MemberCreatorId { get; set; }
    }
}
