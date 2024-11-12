using System.Linq.Expressions;

namespace server.Interfaces
{
    public interface IGenericRepository<T, TId> where T : class
    {
        Task<T?> GetByIdAsync(TId id, params Expression<Func<T, object>>[] includes);
        Task<IEnumerable<T>> GetAllAsync();
        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        void Update(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
