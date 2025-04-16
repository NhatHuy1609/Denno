import { WorkspaceQueries } from "@/entities/workspace"
import { useQuery } from "@tanstack/react-query"
import { workspaceTypes } from "@/entities/workspace"

export const useWorkspaceQuery = (workspaceId: string, filter?: workspaceTypes.WorkspaceFilterQuery) => {
  return useQuery(WorkspaceQueries.workspaceQuery(workspaceId, filter))
}
