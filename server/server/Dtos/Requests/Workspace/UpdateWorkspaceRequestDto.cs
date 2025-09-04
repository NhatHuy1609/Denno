using server.Enums;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Workspace
{
    public class UpdateWorkspaceRequestDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public WorkspaceVisibility? Visibility { get; set; }
    }
}
