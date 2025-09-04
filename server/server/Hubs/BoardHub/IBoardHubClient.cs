namespace server.Hubs.BoardHub
{
    public interface IBoardHubClient : IBaseHubClient
    {
        Task ReceiveMemberRoleChanged();
        Task OnBoardMemberRemoved();
    }
}
