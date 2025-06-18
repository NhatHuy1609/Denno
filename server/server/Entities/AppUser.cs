using Microsoft.AspNetCore.Identity;
using server.Data.Enums;
using server.Repositories;

namespace server.Entities
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; } = string.Empty;
        public string? JobTitle { get; set; } = string.Empty;
        public string? Department { get; set; } = string.Empty;
        public string? BasedIn { get; set; } = string.Empty;
        public string? Organization { get; set; } = string.Empty;
        public string? Avatar { get; set; } = string.Empty;
        public string? CoverImage { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }

        public UserVisibilitySettings UserVisibilitySettings { get; set; } = new UserVisibilitySettings();

        public virtual ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();

        public virtual ICollection<WorkspaceMember> WorkspaceMembers { get; set; } = new List<WorkspaceMember>();

        public virtual ICollection<BoardMember> BoardMembers { get; set; } = new List<BoardMember>();

        public virtual ICollection<CardMember> CardMembers { get; set; } = new List<CardMember>();

        public virtual ICollection<CardCheckListItem> CardCheckListItems { get; set; } = new List<CardCheckListItem>();

        public virtual ICollection<CardComment> CardComments { get; set; } = new List<CardComment>();

        public virtual ICollection<DennoAction> Actions { get; set; } = new List<DennoAction>();

        public virtual ICollection<NotificationRecipient> NotificationRecipients { get; set; } = new List<NotificationRecipient>();

        public virtual ICollection<BoardUserSettings> BoardUserSettings { get; set; } = new List<BoardUserSettings>();
    }
}
