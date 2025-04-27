import { WorkspaceQueries, workspaceTypes } from "@/entities/workspace";
import { ApiQueryOptionsParams } from "../types";
import { useApiQueryWrapper } from "../useApiQueryWrapper";

export const useJoinRequestsQuery = (
  workspaceId: string, 
  options?: ApiQueryOptionsParams<workspaceTypes.WorkspaceJoinRequests>
) => {
  const queryOptions = WorkspaceQueries.workspaceJoinRequestsQuery(workspaceId);

  return useApiQueryWrapper(queryOptions, options)
};