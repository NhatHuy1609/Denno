import { z } from "zod";

export const EntityTypeSchema = z.enum([
  "user",
  "workspace",
  "board",
  "cardList",
  "card",
  "memberCreator",
  "addedMember",
  "joinedMember",
  "requester",
]);

export type EntityType = z.infer<typeof EntityTypeSchema>
