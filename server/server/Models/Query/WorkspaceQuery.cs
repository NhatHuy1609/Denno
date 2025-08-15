using Microsoft.AspNetCore.Mvc;

namespace server.Models.Query
{
    public class WorkspaceQuery
    {
        public string Fields { get; set; } = ""; // Taking all fields as default
        public bool BoardCounts { get; set; } = false;
        public bool JoinRequests { get; set; } = false;

        public bool Members { get; set; } = false;

        [FromQuery(Name = "member_fields")]
        public string? MemberFields { get; set; }

        public bool IncludeGuests { get; set; } = false;
    }
}
