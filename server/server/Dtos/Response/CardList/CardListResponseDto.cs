namespace server.Dtos.Response.CardList
{
    public class CardListResponseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Rank { get; set; }
        public Guid BoardId { get; set; }
    }
}
