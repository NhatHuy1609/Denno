using server.Entities;

namespace server.Strategies.ActionStrategy.Contexts
{
    public class CreateBoardActionContext : DennoActionContext
    {
        public Board BoardData { get; set; }
    }
}
