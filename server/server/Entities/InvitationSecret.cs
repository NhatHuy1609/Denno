using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class InvitationSecret
    {
        [Key]
        public int Id { get; set; }
        public string SecretCode { get; set; } = string.Empty;
        public InvitationTarget Target { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public BoardMemberRole? BoardRole { get; set; }

        public string InviterId { get; set; }
        public AppUser Inviter { get; set; }

        public Guid? BoardId { get; set; }
        public virtual Board? Board { get; set; }

        public Guid? WorkspaceId { get; set; }
        public virtual Workspace? Workspace { get; set; }
    }

    public enum InvitationTarget
    {
        Board,
        Workspace
    }
}
