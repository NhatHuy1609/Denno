using server.Data;
using server.Interfaces;
using server.Repositories;

namespace server.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDBContext _context;
        public IBoardRepository Boards { get; private set; }
        public IWorkspaceRepository Workspaces { get; private set; }


        public UnitOfWork(ApplicationDBContext context)
        {
            _context = context;
            Boards = new BoardRepository(context);
            Workspaces = new WorkspaceRepository(context);
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
