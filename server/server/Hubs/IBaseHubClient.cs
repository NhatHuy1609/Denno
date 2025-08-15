namespace server.Hubs
{
    public interface IBaseHubClient
    {
        Task Error(string message);
        Task Success(string message);
    }
}
