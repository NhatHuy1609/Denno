using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Card
{
    public class RemoveCardMemberRequest
    {
        [Required]
        public string MemberId { get; set; }
        [Required]
        public Guid BoardId { get; set; }
    }
}
