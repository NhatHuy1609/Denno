import { useHubEventListener } from '@/app/_hooks/signalR/useHubEventListener'
import { cardListLib } from '@/entities/cardList'
import { cardLib } from '@/entities/card'
import { useCardQueryCacheActions } from './useCardQueryCacheActions'
import { useCardListQueryCacheActions } from './useCardListQueryCacheActions'

export const useUpdateBoardViewRealtime = ({ boardId }: { boardId: string }) => {
  const { updateCardList, addCardList } = useCardListQueryCacheActions({ boardId })
  const { moveCard, updateCard, addCard } = useCardQueryCacheActions({ boardId })

  useHubEventListener('board', 'OnCardListCreated', (newCreatedCardList) => {
    const newCreatedCardListData = cardListLib.transformCardListDtoToCardList(newCreatedCardList)
    addCardList(newCreatedCardListData)
  })

  useHubEventListener('board', 'OnCardListUpdated', (data) => {
    const updatedCardListData = cardListLib.transformCardListDtoToCardList(data)
    updateCardList(updatedCardListData)
  })

  useHubEventListener('board', 'OnCardCreated', (newCreatedCard) => {
    const newCreatedCardData = cardLib.transformCardDtoToCard(newCreatedCard)
    addCard(newCreatedCardData)
  })

  useHubEventListener('board', 'OnCardUpdated', (newUpdatedCard) => {
    const updatedCardData = cardLib.transformCardDtoToCard(newUpdatedCard)
    updateCard(updatedCardData)
  })

  useHubEventListener('board', 'OnCardRankUpdated', (oldCardListId, newCardListId, updatedCardResponse) => {
    const updatedCardData = cardLib.transformCardDtoToCard(updatedCardResponse)
    moveCard(oldCardListId, newCardListId, updatedCardData)
  })
}
