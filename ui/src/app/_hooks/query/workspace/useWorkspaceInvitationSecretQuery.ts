import { WorkspaceQueries } from "@/entities/workspace"
import { useQuery } from "@tanstack/react-query"

export const useInvitationSecretQuery = (workspaceId: string) => {
  return useQuery(WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId))
}