using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Requests.Board
{
    public class CreateBoardJoinRequest
    {
        [Required]
        public string RequesterId { get; set; }
    }
}
