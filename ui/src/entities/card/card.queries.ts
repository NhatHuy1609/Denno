import { CardService } from '@/service/api/card'
import { queryOptions } from '@tanstack/react-query'
import { normalizeCardDto, normalizeCardMembersDto, transformCardsDtoToCards } from './card.lib'
import { cardSchemas } from '.'

export class CardQueries {
  static readonly keys = {
    root: ['card'] as const,
    list: () => [...this.keys.root, 'list'],
    detail: (cardId: string) => [...this.keys.root, 'detail', cardId]
  }

  static cardsByCardListQuery(cardListId: string) {
    return queryOptions({
      queryKey: [...this.keys.list(), `card-[${cardListId}]`] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await CardService.cardsByCardListQuery({ cardListId }, { signal })
        return transformCardsDtoToCards(response.data)
      }
    })
  }

  static cardQuery(cardId: string, filter?: cardSchemas.CardQuery) {
    return queryOptions({
      queryKey: [...this.keys.detail(cardId), filter, cardId] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await CardService.getCard(cardId, {
          params: filter
        })
        return normalizeCardDto(response.data)
      }
    })
  }

  static cardMembersQuery(cardId: string) {
    return queryOptions({
      queryKey: [...this.keys.detail(cardId), 'members', cardId] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await CardService.getCardMembers(cardId)
        return normalizeCardMembersDto(response.data)
      }
    })
  }
}
