using server.Data;
using server.Entities;
using server.Strategies.ActionStrategy.Contexts;
using server.Strategies.ActionStrategy.Interfaces;

namespace server.Strategies.ActionStrategy
{
    public class JoinBoardStrategy : IDennoActionStrategy
    {
        private readonly ApplicationDBContext _dbContext;

        public JoinBoardStrategy(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<DennoAction> Execute(DennoActionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
