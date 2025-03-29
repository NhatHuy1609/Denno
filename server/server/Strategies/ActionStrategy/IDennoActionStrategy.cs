using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public interface IDennoActionStrategy
    {
        Task<DennoAction> Execute(DennoActionContext context);
    }
}
