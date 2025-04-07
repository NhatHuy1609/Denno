
using Newtonsoft.Json;

namespace server.Dtos.Response.Workspace
{
    public class UserWorkspaceResponse
    {
        public Guid Id { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string? Name { get; set; } = null;
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string? Logo { get; set; } = null;
    }
}
