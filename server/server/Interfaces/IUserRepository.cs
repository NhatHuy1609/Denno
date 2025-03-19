using server.Models;
using server.Models.Pagination;
using server.Models.Query;

namespace server.Interfaces
{
    public interface IUserRepository: IGenericRepository<AppUser, string>
    {
        Task<PaginatedResult<AppUser>> GetUsersAsync(UserQueryModel query);
    }
}
