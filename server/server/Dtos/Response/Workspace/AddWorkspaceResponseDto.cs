namespace server.Dtos.Response.Workspace
{
    public class AddWorkspaceResponseDto
    {
        public Guid ActionId { get; set; }
        public DateTime Date { get; set; }
        public string ActionType { get; set; }
        public string WorkspaceId { get; set;}
        public string MemberCreatorId { get; set; }
        public string TargetUserId { get; set; }
    }
}
