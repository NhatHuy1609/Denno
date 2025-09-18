using server.Dtos.Response.Users;

namespace server.Dtos.Response.Card
{
    public class CardMembersResponse
    {
        public Guid CardId { get; set; }
        public List<GetUserResponseDto> Members { get; set; } = new();
    }
}
