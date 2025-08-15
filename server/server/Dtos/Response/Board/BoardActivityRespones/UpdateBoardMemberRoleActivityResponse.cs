using server.Constants;
using server.Dtos.Response.Board.BoardActivityRespones.Bases;
using server.Entities;
using static server.Dtos.Response.Board.BoardActivityRespones.UpdateBoardMemberRoleActivityResponse;

namespace server.Dtos.Response.Board.BoardActivityRespones
{
    public class UpdateBoardMemberRoleActivityResponse : BoardActivityResponse<UpdateBoardMemberRoleActivityData, BoardActivityDisplay>
    {
        public UpdateBoardMemberRoleActivityResponse()
        {
            Type = ActionTypes.UpdateBoardMemberRole;
        }

        public class UpdateBoardMemberRoleActivityData
        {
            public string MemberCreatorId { get; set; }
            public string UpdatedMemberId { get; set; }
            public BoardMemberRole NewMemberRole { get; set; }
            public Guid BoardId { get; set; }
        }
    }
}
