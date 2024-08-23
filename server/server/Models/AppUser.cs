using Microsoft.AspNetCore.Identity;
using server.Data.Enums;

namespace server.Models
{
    public class AppUser: IdentityUser
    {
        public string? FullName { get; set; } = string.Empty;
        public string? JobTitle { get; set; } = string.Empty;
        public string? Department { get; set; } = string.Empty;
        public string? BasedIn { get; set; } = string.Empty;
        public string? Organization { get; set; } = string.Empty;
        public string? Avatar { get; set; } = string.Empty;
        public string? CoverImage { get; set; } = string.Empty;
        public UserInformationVisibility FullNameVisibility { get; set; } = 0;
        public UserInformationVisibility JobTitleVisibility { get; set; } = 0;
        public UserInformationVisibility DepartmentVisibility { get; set; } = 0;
        public UserInformationVisibility OrganizationVisibility { get; set; } = 0;
        public UserInformationVisibility BasedInVisibility { get; set; } = 0;
        public UserInformationVisibility EmailVisibility { get; set; } = 0;
        public UserInformationVisibility AvatarVisibility { get; set; } = 0;

        public virtual ICollection<Workspace> OwnedWorkspaces { get; set; } = new List<Workspace>();

        public virtual ICollection<WorkspaceMember> WorkspaceMembers { get; set; } = new List<WorkspaceMember>();

        public virtual ICollection<BoardMember> BoardMembers { get; set; } = new List<BoardMember>();

        public virtual ICollection<CardMember> CardMembers { get; set; } = new List<CardMember>();

        public virtual ICollection<CardCheckListItem> CardCheckListItems { get; set; } = new List<CardCheckListItem>();

        public virtual ICollection<CardComment> CardComments { get; set; } = new List<CardComment>();

        public virtual ICollection<CardActivity> CardActivities { get; set; } = new List<CardActivity>();
    }
}
