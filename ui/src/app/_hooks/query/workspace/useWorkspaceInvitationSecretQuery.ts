import { InvitationSecret } from "@/entities/invitationSecret/invitationSecret.types"
import { WorkspaceQueries } from "@/entities/workspace"
import { QueryOptions, useQuery } from "@tanstack/react-query"

export const useInvitationSecretQuery = (
  workspaceId: string, 
  options?: Omit<QueryOptions<
    InvitationSecret, // Return type from your query
    Error,
    InvitationSecret, // TData (what you want to select/transform to)
    string[] // Use QueryKey instead of string[]
  >, 'queryKey' | 'queryFn'>
) => {
  const queryOptions = WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId);
  
  return useQuery({
    ...queryOptions,
    ...options
  });
};