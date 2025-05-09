import { z } from "zod";

export const RejectWorkspaceJoinRequestDataSchema = z.object({
  workspaceId: z.string().uuid(),
  memberCreatorId: z.string(),
  requesterId: z.string(),
});