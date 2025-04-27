import { z } from 'zod'

const ActionDtoSchema = z.object({
  id: z.string().uuid(),
  actionType: z.string(),
  date: z.string(),
  memberCreatorId: z.string().optional().nullable(),
  cardId: z.string().uuid().optional().nullable(),
  boardId: z.string().uuid().optional().nullable(),
  cardListId: z.string().uuid().optional().nullable(),
  workspaceId: z.string().uuid().optional().nullable(),
  targetUserId: z.string().optional().nullable(),
  targetCardId: z.string().uuid().optional().nullable(),
  targetBoardId: z.string().uuid().optional().nullable(),
  targetListId: z.string().uuid().optional().nullable(),
  commentId: z.string().uuid().optional().nullable(),

}).describe("ActionDtoSchema")

export const AddWorkspaceMemberActionResponseDtoSchema = ActionDtoSchema.pick({
  id: true,
  date: true,
  actionType: true,
  workspaceId: true,
  memberCreatorId: true,
  targetUserId: true
}).describe("AddWorkspaceMemberActionResponseDtoSchema")

export const JoinWorkspaceByLinkActionResponseDtoSchema = ActionDtoSchema.pick({
  id: true,
  date: true,
  actionType: true,
  workspaceId: true,
  memberCreatorId: true
}).describe("JoinWorkspaceByLinkActionResponseDtoSchema")