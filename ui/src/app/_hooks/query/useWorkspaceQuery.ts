import { WorkspaceQueries } from "@/entities/workspace"
import { useQuery } from "@tanstack/react-query"

export const useWorkspaceQuery = (workspaceId: string) => {
  return useQuery(WorkspaceQueries.workspaceQuery(workspaceId))
}
