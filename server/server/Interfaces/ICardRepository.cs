using server.Models;

namespace server.Interfaces
{
    public interface ICardRepository: IGenericRepository<Card, Guid>
    {
        Task<IEnumerable<Card>> GetCardsByCardListIdAsync(Guid cardListId);
    }
}
