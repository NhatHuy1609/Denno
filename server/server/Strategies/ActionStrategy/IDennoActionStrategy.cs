using server.Entities;

namespace server.Strategies.ActionStrategy
{
    public interface IDennoActionStrategy
    {
        DennoAction Execute(DennoActionContext context);
    }
}
