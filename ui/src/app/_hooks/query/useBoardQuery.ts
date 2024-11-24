import { BoardQueries } from "@/entities/board"
import { useQuery } from "@tanstack/react-query"

export const useBoardQuery = (boardId: string) => {
  return useQuery(BoardQueries.boardQuery(boardId))
}