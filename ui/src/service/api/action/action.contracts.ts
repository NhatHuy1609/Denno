import { z } from 'zod'

const ActionDtoSchema = z.object({
  id: z.string().uuid(),
  actionType: z.string(),
  date: z.string(),
  memberCreatorId: z.string(),
  cardId: z.string().uuid(),
  boardId: z.string().uuid(),
  cardListId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  targetUserId: z.string(),
  targetCardId: z.string().uuid(),
  targetBoardId: z.string().uuid(),
  targetListId: z.string().uuid(),
  commentId: z.string().uuid(),

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