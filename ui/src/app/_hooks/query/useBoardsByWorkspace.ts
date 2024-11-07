import { useQuery } from "@tanstack/react-query"
import { BoardQueries } from "@/entities/board"

export const useBoardsByWorkspace = (workspaceId: string) => {
  return useQuery(BoardQueries.boardsByWorkspaceIdQuery(workspaceId))
}