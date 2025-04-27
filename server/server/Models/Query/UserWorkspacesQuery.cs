namespace server.Models.Query.UserWorkspacesQuery
{
    public class UserWorkspacesQuery
    {
        public FilterType Filter { get; set; } = FilterType.All;
        public FieldsType Fields { get; set; } = FieldsType.All;
    }

    public enum FilterType
    {
        None = 0,
        Members = 1,
        Public = 2,
        All = Members | Public
    }

    [Flags]
    public enum FieldsType
    {
        None = 0,
        Id = 1,
        Name = 2,
        Logo = 4,
        All = Id | Name | Logo
    }
}
