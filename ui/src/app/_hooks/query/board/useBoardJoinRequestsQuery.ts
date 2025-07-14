import { BoardQueries, boardTypes } from "@/entities/board";
import { ApiQueryOptionsParams } from "../types";
import { useApiQueryWrapper } from "../useApiQueryWrapper";

export const useBoardJoinRequestsQuery = (
  boardId: string, 
  options?: ApiQueryOptionsParams<boardTypes.BoardJoinRequests>
) => {
  const queryOptions = BoardQueries.boardJoinRequestsQuery(boardId);

  return useApiQueryWrapper(queryOptions, options)
};