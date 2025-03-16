using server.Data;
using server.Interfaces;
using server.Repositories;

namespace server.UnitOfWorks
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDBContext _context;
        public IUserRepository Users { get; private set; }
        public IBoardRepository Boards { get; private set; }
        public IWorkspaceRepository Workspaces { get; private set; }
        public IFileUploadRepository FileUploads { get; private set; }
        public ICardListRepository CardLists { get; private set; }
        public ICardRepository Cards { get; private set; }
        public IWorkspaceMemberRepository WorkspaceMembers { get; set; }

        public UnitOfWork(ApplicationDBContext context)
        {
            _context = context;
            Users = new UserRepository(context);
            Boards = new BoardRepository(context);
            Workspaces = new WorkspaceRepository(context);
            CardLists = new CardListRepository(context);
            Cards = new CardRepository(context);
            FileUploads = new FileUploadRepository(context);
            WorkspaceMembers = new WorkspaceMemberRepository(context);
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
