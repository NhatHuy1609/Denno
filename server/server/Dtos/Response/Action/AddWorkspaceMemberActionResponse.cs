namespace server.Dtos.Response.Action
{
    public class AddWorkspaceMemberActionResponse
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string ActionType { get; set; }
        public string WorkspaceId { get; set; }
        public string MemberCreatorId { get; set; }
        public string TargetUserId { get; set; }
    }
}
