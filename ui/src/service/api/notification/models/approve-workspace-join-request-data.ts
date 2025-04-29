import { z } from "zod";

export const ApproveWorkspaceJoinRequestDataSchema = z.object({
  workspaceId: z.string().uuid(),
  requesterId: z.string(),
  memberCreatorId: z.string(),
});