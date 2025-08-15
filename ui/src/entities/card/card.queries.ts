import { CardService } from '@/service/api/card'
import { queryOptions } from '@tanstack/react-query'
import { transformCardsDtoToCards } from './card.lib'

export class CardQueries {
  static readonly keys = {
    root: ['card'] as const,
    list: () => [...this.keys.root, 'list']
  }

  static cardsByCardListQuery(cardListId: string) {
    return queryOptions({
      queryKey: [...this.keys.list(), `card-[${cardListId}]`],
      queryFn: async ({ signal }) => {
        const response = await CardService.cardsByCardListQuery({ cardListId }, { signal })
        return transformCardsDtoToCards(response.data)
      }
    })
  }
}
