using server.Entities;

namespace server.Interfaces
{
    public interface ICardListRepository: IGenericRepository<CardList, Guid>
    {
        Task<IEnumerable<CardList>> GetCardListsByBoardIdAsync(Guid boardId);
    }
}
