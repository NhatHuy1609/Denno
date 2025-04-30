import { z } from "zod";

export const TranslationKeySchema = z.enum([
  "notification_added_to_workspace",
  "notification_joined_workspace_via_link",
  "notification_approve_workspace_joinRequest",
  "notification_reject_workspace_joinRequest",
  "notification_send_workspace_joinRequest",
]);

export type TranslationKey = z.infer<typeof TranslationKeySchema>;
