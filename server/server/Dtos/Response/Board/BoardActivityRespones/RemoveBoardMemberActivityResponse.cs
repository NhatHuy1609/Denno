using server.Constants;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using static server.Dtos.Response.Board.BoardActivityRespones.RemoveBoardMemberActivityResponse;

namespace server.Dtos.Response.Board.BoardActivityRespones
{
    public class RemoveBoardMemberActivityResponse : BoardActivityResponse<RemoveBoardMembeActivityData, BoardActivityDisplay>
    {
        public RemoveBoardMemberActivityResponse()
        {
            Type = ActionTypes.RemoveBoardMember;
        }

        public class RemoveBoardMembeActivityData
        {
            public string MemberCreatorId { get; set; }
            public string RemovedUserId { get; set; }
            public Guid BoardId { get; set; }
        }
    }
}
