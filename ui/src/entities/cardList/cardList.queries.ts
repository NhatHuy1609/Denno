import { queryOptions } from '@tanstack/react-query'
import { CardListService } from '@/service/api/cardList'
import { transformCardListDtoToCardList, transformCardListsDtoToCardLists } from './cardList.lib'

export class CardListQueries {
  static readonly keys = {
    root: ['cardList'] as const,
    list: () => [...this.keys.root, 'list']
  }

  static cardListsByBoardQuery(boardId: string) {
    return queryOptions({
      queryKey: [...this.keys.list(), `board-[${boardId}]`] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await CardListService.cardListsByBoardQuery({ boardId }, { signal })
        return transformCardListsDtoToCardLists(response.data)
      }
    })
  }

  static cardListQuery(cardListId: string) {
    return queryOptions({
      queryKey: [...this.keys.list(), `cardList-[${cardListId}]`] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await CardListService.getCardList(cardListId, { signal })
        return transformCardListDtoToCardList(response.data)
      }
    })
  }
}
