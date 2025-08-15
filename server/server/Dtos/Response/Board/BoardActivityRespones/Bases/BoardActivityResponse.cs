using server.Dtos.Response.Board.BoardActivityRespones.Interfaces;
using server.Dtos.Response.Users;

namespace server.Dtos.Response.Board.BoardActivityRespones.Bases
{
    public class BoardActivityResponse<TData, TDisplay> : IBoardActivityResponse
    {
        public Guid ActionId { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public string MemberCreatorId { get; set; }

        public GetUserResponseDto MemberCreator { get; set; }
        public TData Data { get; set; }
        public TDisplay Display { get; set; }
    }
}
