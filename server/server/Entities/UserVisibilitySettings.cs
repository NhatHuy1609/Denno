using server.Data.Enums;
using server.Models;

namespace server.Entities
{
    public class UserVisibilitySettings
    {
        public string Id { get; set; }
        public UserInformationVisibility FullNameVisibility { get; set; } = 0;
        public UserInformationVisibility JobTitleVisibility { get; set; } = 0;
        public UserInformationVisibility DepartmentVisibility { get; set; } = 0;
        public UserInformationVisibility OrganizationVisibility { get; set; } = 0;
        public UserInformationVisibility BasedInVisibility { get; set; } = 0;
        public UserInformationVisibility EmailVisibility { get; set; } = 0;
        public UserInformationVisibility AvatarVisibility { get; set; } = 0;
    }
}
