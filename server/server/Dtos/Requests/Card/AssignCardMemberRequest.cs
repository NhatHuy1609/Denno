using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Card
{
    public class AssignCardMemberRequest
    {
        [Required]
        public Guid CardId { get; set; }
        [Required]
        public string AssignedMemberId { get; set; }
        [Required]
        public Guid BoardId { get; set; }
    }
}
