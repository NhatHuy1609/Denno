import { z } from "zod";

export const ActionTypeSchema = z.enum([
  "addMemberToWorkspace",
  "addMemberToBoard",
  "joinWorkspaceByLink",
  "approveWorkspaceJoinRequest",
  "rejectWorkspaceJoinRequest",
  "sendWorkspaceJoinRequest",
]);

export type ActionType = z.infer<typeof ActionTypeSchema>;