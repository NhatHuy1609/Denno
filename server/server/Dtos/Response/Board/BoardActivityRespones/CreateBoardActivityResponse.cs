using server.Constants;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;

namespace server.Dtos.Response.Board.BoardActivityRespones
{
    public class CreateBoardActivityResponse : BoardActivityResponse<CreateBoardActivityData, BoardActivityDisplay>
    {
        public CreateBoardActivityResponse()
        {
            Type = ActionTypes.CreateBoard;
        }
    }

    public class  CreateBoardActivityData 
    {
        public string MemberCreatorId { get; set; }
        public Guid WorkspaceId { get; set; }
        public Guid BoardId { get; set; }
    }
}
