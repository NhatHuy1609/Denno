using server.Entities;
using server.Strategies.ActionStrategy.Contexts;

namespace server.Strategies.ActionStrategy.Interfaces
{
    public interface IDennoActionStrategy
    {
        Task<DennoAction> Execute(DennoActionContext context);
    }
}
