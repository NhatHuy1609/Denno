using server.Factories.BoardActivityResponseFactory.Interfaces;

namespace server.Factories.BoardActivityResponseFactory.Helpers
{
    public class BoardActivityResponseFactoryResolver
    {
        private readonly IEnumerable<IBoardActivityResponseFactory> _factories;

        public BoardActivityResponseFactoryResolver(
            IEnumerable<IBoardActivityResponseFactory> factories)
        {
            _factories = factories;
        }
         
        public IBoardActivityResponseFactory GetFactory(string actionType)
        {
            var factory = _factories.FirstOrDefault(f => f.CanHandle(actionType));

            if (factory == null)
            {
                throw new ArgumentException($"No factory found for action type: {actionType}");
            }

            return factory;
        }
    }
}
