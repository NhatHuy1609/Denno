using server.Entities;
using server.Strategies.ActionStrategy.Contexts;

namespace server.Strategies.ActionStrategy.Interfaces
{
    public interface IDennoActionStrategy
    {
        bool CanHandle(string actionType);
        Task<DennoAction> Execute(DennoActionContext context);
    }
}
