using server.Dtos.Response.Card;

namespace server.Dtos.Response.CardList
{
    public class CardListResponseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Rank { get; set; }
        public Guid BoardId { get; set; }
        public IList<CardResponseDto> Cards { get; set; } = new List<CardResponseDto>();
    }
}
