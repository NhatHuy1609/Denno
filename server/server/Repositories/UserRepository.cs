using server.Data;
using server.Interfaces;
using server.Models;

namespace server.Repositories
{
    public class UserRepository : GenericRepository<AppUser, string>, IUserRepository
    {
        public UserRepository(ApplicationDBContext context) : base(context)
        {
        }
    }
}
