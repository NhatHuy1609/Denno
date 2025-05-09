import { z } from "zod";

export const JoinWorkspaceByLinkDataSchema = z.object({
  workspaceId: z.string().uuid(),
  joinedMemberId: z.string(),
});