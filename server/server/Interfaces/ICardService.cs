using server.Models.Results;

namespace server.Interfaces
{
    public interface ICardService
    {
        Task<Result<bool>> MarkCardAsCompletedAsync(Guid cardId);
        Task<Result<bool>> MarkCardAsInCompletedAsync(Guid cardId);
    }
}
