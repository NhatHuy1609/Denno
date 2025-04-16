import { WorkspaceQueries } from "@/entities/workspace";
import { DetailedWorkspaceInvitation } from "@/entities/workspace/workspace.types";
import { ApiQueryOptionsParams } from "../types";
import { useApiQueryWrapper } from "../useApiQueryWrapper";

export const useDetailedWorkspaceInvitationQuery = (
  workspaceId: string, 
  options?: ApiQueryOptionsParams<DetailedWorkspaceInvitation>
) => {
  const queryOptions = WorkspaceQueries.detailedWorkspaceInvitationQuery(workspaceId);
  
  return useApiQueryWrapper(queryOptions, options)
};