using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using server.Models.Pagination;
using server.Models.Query;

namespace server.Repositories
{
    public class UserRepository : GenericRepository<AppUser, string>, IUserRepository
    {
        public UserRepository(ApplicationDBContext context) : base(context)
        {
        }

        public async Task<AppUser?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        }

        public async Task<PaginatedResult<AppUser>> GetUsersAsync(UserQueryModel query)
        {
            IQueryable<AppUser> userQuery = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(query.Name))
            {
                userQuery = userQuery.Where(u => u.FullName.Contains(query.Name));
            }

            if (!string.IsNullOrEmpty(query.Email))
            {
                userQuery = userQuery.Where(u => u.Email.Equals(query.Email));
            }

            int totalCount = await userQuery.CountAsync();

            var pageSize = query.PageSize ?? 50;
            var pageNumber = query.PageNumber ?? 1;

            var pagedUsers = await userQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResult<AppUser>()
            {
                Items = pagedUsers,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
