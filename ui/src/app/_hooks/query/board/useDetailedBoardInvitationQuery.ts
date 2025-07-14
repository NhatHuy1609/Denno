import { BoardQueries } from "@/entities/board";
import { DetailedBoardInvitation } from "@/entities/board/board.types";
import { ApiQueryOptionsParams } from "../types";
import { useApiQueryWrapper } from "../useApiQueryWrapper";

export const useDetailedBoardInvitationQuery = (
  boardId: string, 
  options?: ApiQueryOptionsParams<DetailedBoardInvitation>
) => {
  const queryOptions = BoardQueries.detailedBoardInvitationQuery(boardId);
  
  return useApiQueryWrapper(queryOptions, options)
};