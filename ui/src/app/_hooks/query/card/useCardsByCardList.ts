import { CardQueries } from "@/entities/card"
import { useQuery } from "@tanstack/react-query"

interface Params {
  cardListId: string
}

export const useCardsByCardList = ({ cardListId}: Params) => {
  return useQuery(CardQueries.cardsByCardListQuery(cardListId))
}