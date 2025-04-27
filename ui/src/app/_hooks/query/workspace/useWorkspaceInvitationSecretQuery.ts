import { InvitationSecret } from "@/entities/invitationSecret/invitationSecret.types"
import { WorkspaceQueries } from "@/entities/workspace"
import { useApiQueryWrapper } from "../useApiQueryWrapper";
import { ApiQueryOptionsParams } from "../types";

export const useInvitationSecretQuery = (
  workspaceId: string, 
  options?: ApiQueryOptionsParams<InvitationSecret>
) => {
  const queryOptions = WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId);

  return useApiQueryWrapper(queryOptions, options)
};