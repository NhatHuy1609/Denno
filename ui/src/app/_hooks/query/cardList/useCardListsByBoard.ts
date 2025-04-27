import { useQuery } from "@tanstack/react-query";
import { CardListQueries } from "@/entities/cardList";

export const useCardListsByBoards = (boardId: string) => {
  return useQuery(CardListQueries.cardListsByBoardQuery(boardId))
}