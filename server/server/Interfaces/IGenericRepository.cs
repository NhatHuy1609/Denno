using System.Linq.Expressions;

namespace server.Interfaces
{
    public interface IGenericRepository<T, TId> where T : class
    {
        Task<T> GetByIdAsync(TId id);
        Task<IEnumerable<T>> GetAllAsync();
        IEnumerable<T> FindAsync(Expression<Func<T, bool>> expression);
        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
