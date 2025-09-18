using server.Dtos.Response.Card;
using server.Dtos.Response.CardList;

namespace server.Hubs.BoardHub
{
    public interface IBoardHubClient : IBaseHubClient
    {
        Task ReceiveMemberRoleChanged();
        Task OnBoardMemberRemoved();
        Task OnCardListCreated(CardListResponseDto newCreatedCardList);
        Task OnCardListUpdated(CardListResponseDto newUpdatedCardList);
        Task OnCardCreated(CardResponseDto newCreatedCard);
        Task OnCardUpdated(CardResponseDto newUpdatedCard);
        Task OnCardRankUpdated(Guid oldCardListId, Guid? newCardListId, CardResponseDto updatedCardResponse);
        Task OnCardMemberAssigned();
        Task OnCardMemberRemoved();
    }
}
