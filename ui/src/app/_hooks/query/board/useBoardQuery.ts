import { BoardQueries, boardTypes } from "@/entities/board"
import { useQuery } from "@tanstack/react-query"

export const useBoardQuery = (boardId: string, filter?: boardTypes.BoardQueryFilter) => {
  return useQuery(BoardQueries.boardQuery(boardId, filter))
}