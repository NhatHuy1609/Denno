namespace server.Strategies.ActionStrategy.Contexts
{
    public class DennoActionContext
    {
        public string MemberCreatorId { get; set; }
        public bool IsBoardActivity { get; set; } = false;
        public Guid? CardId { get; set; }
        public Guid? BoardId { get; set; }
        public Guid? ListId { get; set; }
        public Guid? WorkspaceId { get; set; }
        public string? TargetUserId { get; set; }
        public Guid? TargetCardId { get; set; }
        public Guid? TargetListId { get; set; }
        public Guid? TargetBoardId { get; set; }
        public Guid? CommentId { get; set; }
    }
}
