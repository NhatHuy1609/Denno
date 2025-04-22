using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class JoinRequest
    {
        [Key]
        public int Id { get; set; }
        public string RequesterId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Guid? BoardId { get; set; }
        [JsonIgnore]
        public Board? Board { get; set; }

        public Guid? WorkspaceId { get; set; }
        [JsonIgnore]
        public Workspace? Workspace { get; set; }
    }
}
