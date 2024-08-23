using System.ComponentModel;

namespace server.Data.Enums
{
    public enum UserInformationVisibility
    {
        [Description("Visible to anyone who can view your content.Accessible by installed apps.")]
        Anyone = 0,
        [Description("Only visible to you.")]
        OnlyYou = 1
    }
}
