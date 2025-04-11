namespace server.Entities
{
    public class InvitationSecret
    {
        public int Id { get; set; }
        public string SecretCode { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string CreatedByUserId { get; set; }

        public Guid? BoardId { get; set; }
        public virtual Board? Board { get; set; }

        public Guid? WorkspaceId { get; set; }
        public virtual Workspace? Workspace { get; set; }
    }
}
