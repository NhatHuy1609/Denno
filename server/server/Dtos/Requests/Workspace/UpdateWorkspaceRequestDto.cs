using server.Enums;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Workspace
{
    public class UpdateWorkspaceRequestDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
