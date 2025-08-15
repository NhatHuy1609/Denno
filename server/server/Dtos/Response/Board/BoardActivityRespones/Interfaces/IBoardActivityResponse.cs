namespace server.Dtos.Response.Board.BoardActivityRespones.Interfaces
{
    public interface IBoardActivityResponse
    {
        Guid ActionId { get; set; }
        string Type { get; set; }
        DateTime Date { get; set; }
        string MemberCreatorId { get; set; }
    }
}
