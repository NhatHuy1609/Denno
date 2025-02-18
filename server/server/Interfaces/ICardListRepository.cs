using server.Models;

namespace server.Interfaces
{
    public interface ICardListRepository: IGenericRepository<CardList, Guid>
    {
        Task<IEnumerable<CardList>> GetCardListsByBoardIdAsync(Guid boardId);
    }
}
