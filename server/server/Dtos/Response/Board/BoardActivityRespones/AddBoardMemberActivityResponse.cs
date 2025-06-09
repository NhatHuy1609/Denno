using server.Constants;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;

namespace server.Dtos.Response.Board.BoardActivityRespones
{
    public class AddBoardMemberActivityResponse : BoardActivityResponse<AddBoardMemberActivityData, BoardActivityDisplay>
    {
        public AddBoardMemberActivityResponse()
        {
            Type = ActionTypes.AddMemberToBoard;
        }
    }

    public class AddBoardMemberActivityData
    {
        public string MemberCreatorId { get; set; }
        public string AddedMember { get; set; }
        public Guid BoardId { get; set; }
    }
}
