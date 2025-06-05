namespace server.Dtos.Response.Board.BoardActivityRespones.Interfaces
{
    public interface IBoardActivityResponse
    {
        int Id { get; set; }
        string Type { get; set; }
        DateTime Date { get; set; }
        string MemberCreatorId { get; set; }
        Guid ActionId { get; set; }
    }
}
