import { z } from "zod";

export const AddedToWorkspaceDataSchema = z.object({
  workspaceId: z.string().uuid(),
  addedMemberId: z.string(),
  memberCreatorId: z.string(),
});