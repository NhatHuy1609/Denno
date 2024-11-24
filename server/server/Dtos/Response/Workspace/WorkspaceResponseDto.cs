using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using server.Enums;

namespace server.Dtos.Response.Workspace
{
    public class WorkspaceResponseDto
    {
        public Guid Id { get; set; }
        public string OwnerId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public string LogoUrl { get; set; } = string.Empty;
        [JsonConverter(typeof(StringEnumConverter))]
        public WorkspaceVisibility Visibility { get; set; } = 0;
    }
}
