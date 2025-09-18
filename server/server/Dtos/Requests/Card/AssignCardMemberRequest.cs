using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Card
{
    public class AssignCardMemberRequest
    {
        [Required]
        public string AssignedMemberId { get; set; }
    }
}
