namespace server.Models.Query
{
    public class BoardQueryOptions
    {
        public bool IncludeBoardMembers { get; set; }
        public bool IncludeCardLists { get; set; }
        public bool IncludeBoardLabels { get; set; }
        public bool IncludeBoardRestrictions { get; set; }
        public bool IncludeActions { get; set; }
        public bool IncludeJoinRequests { get; set; }
        public bool IncludeBoardUserSettings { get; set; }
        public bool IncludeWorkspace { get; set; }
    }
}
