import { useHubEventListener } from '@/app/_hooks/signalR/useHubEventListener'
import { useUpdateCardsOfCardListQueryCache } from './useUpdateCardsOfCardListQueryCache'
import { useUpdateCardListsOfBoardQueryCache } from './useUpdateCardListsOfBoardQueryCache'
import { cardListLib } from '@/entities/cardList'
import { cardLib } from '@/entities/card'
import { useUpdateCardCompletionStatusQueryCache } from './useUpdateCardCompletionStatusOfCardListsQueryCache'

export const useUpdateBoardViewRealtime = ({ boardId }: { boardId: string }) => {
  const { updateQueryCache: updateCardsOfCardListQueryCache } = useUpdateCardsOfCardListQueryCache({ boardId })
  const { updateQueryCache: updateCardListsOfBoardQueryCache } = useUpdateCardListsOfBoardQueryCache({ boardId })
  const { updateQueryCache: updateCardCompletionStatusQueryCache } = useUpdateCardCompletionStatusQueryCache({
    boardId
  })

  useHubEventListener('board', 'OnCardListUpdated', (data) => {
    // console.log('OnCardListUpdated TRIGGER')
    const updatedCardListData = cardListLib.transformCardListDtoToCardList(data)
    updateCardListsOfBoardQueryCache(updatedCardListData)
  })

  useHubEventListener('board', 'OnCardRankUpdated', (oldCardListId, newCardListId, updatedCardResponse) => {
    console.log('OnCardRankUpdated TRIGGER')
    const updatedCardData = cardLib.transformCardDtoToCard(updatedCardResponse)
    updateCardsOfCardListQueryCache(oldCardListId, newCardListId, updatedCardData)
  })

  useHubEventListener('board', 'OnCardUpdated', (newUpdatedCard) => {
    const updatedCardData = cardLib.transformCardDtoToCard(newUpdatedCard)
    updateCardCompletionStatusQueryCache(updatedCardData)
  })
}
