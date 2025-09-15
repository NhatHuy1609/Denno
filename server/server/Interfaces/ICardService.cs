using server.Dtos.Requests.Card;
using server.Entities;
using server.Models.Query;
using server.Models.Results;

namespace server.Interfaces
{
    public interface ICardService
    {
        Task<IList<CardMember>> GetCardMembersAsync(Guid cardId);
        Task<Card?> GetDetailedCardAsync(Guid cardId, CardQueryModel query);
        Task<Result<bool>> MarkCardAsCompletedAsync(Guid cardId);
        Task<Result<bool>> MarkCardAsInCompletedAsync(Guid cardId);
        Task<Card?> UpdateCardAsync(Guid cardId, UpdateCardRequest request);
    }
}
