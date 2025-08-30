import { z } from 'zod'
import { ActionTypeSchema } from '../_constants/action-types'
import { AddedToWorkspaceDataSchema } from './models/added-to-workspace-data'
import { NotificationDisplaySchema } from './models/notification-display'
import { ApproveWorkspaceJoinRequestDataSchema } from './models/approve-workspace-join-request-data'
import { JoinWorkspaceByLinkDataSchema } from './models/join-workspace-by-link-data'
import { RejectWorkspaceJoinRequestDataSchema } from './models/reject-workspace-join-request'
import { GetUserResponseDtoSchema } from '../user/user.contracts'
import { SendWorkspaceJoinRequestDataSchema } from './models/send-workspace-joinRequest-data'
import { AddMemberToBoardDataSchema } from './models/add-member-to-board-data'
import { JoinBoardByLinkDataSchema } from './models/join-board-by-link-data'
import { ApproveBoardJoinRequestDataSchema } from './models/approve-board-joinRequest-data'
import { RejectBoardJoinRequestDataSchema } from './models/reject-board-joinRequest-data'
import { RemoveBoardMemberDataSchema } from './models/remove-board-member-data'
import { UpdateWorkspaceMemberRoleDataSchema } from './models/update-workspace-member-role-data'
import { RemoveWorkspaceMemberDataSchema } from './models/remove-workspace-member-data'
import { RemoveWorkspaceGuestDataSchema } from './models/remove-workspace-guest-data'

const NotificationResponseDtoBaseSchema = z.object({
  id: z.number(),
  isRead: z.boolean(),
  type: ActionTypeSchema,
  date: z.string().datetime(),
  dateRead: z.string().datetime().nullable(),
  memberCreatorId: z.string(),
  actionId: z.string().uuid(),
  memberCreator: GetUserResponseDtoSchema,

  display: NotificationDisplaySchema
})

export const AddedToWorkspaceNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.addMemberToWorkspace),
  data: AddedToWorkspaceDataSchema
})

export const ApproveWorkspaceJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.approveWorkspaceJoinRequest),
  data: ApproveWorkspaceJoinRequestDataSchema
})

export const JoinWorkspaceByLinkNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.joinWorkspaceByLink),
  data: JoinWorkspaceByLinkDataSchema
})

export const RejectWorkspaceRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.rejectWorkspaceJoinRequest),
  data: RejectWorkspaceJoinRequestDataSchema
})

export const SendWorkspaceJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.sendWorkspaceJoinRequest),
  data: SendWorkspaceJoinRequestDataSchema
})

export const AddMemberToBoardNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.addMemberToBoard),
  data: AddMemberToBoardDataSchema
})

export const JoinBoardByLinkNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.joinBoardByLink),
  data: JoinBoardByLinkDataSchema
})

export const SendBoardJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.sendBoardJoinRequest),
  data: z.any()
})

export const ApproveBoardJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.approveBoardJoinRequest),
  data: ApproveBoardJoinRequestDataSchema
})

export const RejectBoardJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.rejectBoardJoinRequest),
  data: RejectBoardJoinRequestDataSchema
})

export const RemoveBoardMemberNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.removeBoardMember),
  data: RemoveBoardMemberDataSchema
})

export const UpdateWorkspaceMemberRoleNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.updateWorkspaceMemberRole),
  data: UpdateWorkspaceMemberRoleDataSchema
})

export const RemoveWorkspaceMemberNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.removeWorkspaceMember),
  data: RemoveWorkspaceMemberDataSchema
})

export const RemoveWorkspaceGuestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.removeWorkspaceGuest),
  data: RemoveWorkspaceGuestDataSchema
})

export const NotificationResponseDtoSchema = z.discriminatedUnion('type', [
  AddedToWorkspaceNotificationSchema,
  ApproveWorkspaceJoinRequestNotificationSchema,
  JoinWorkspaceByLinkNotificationSchema,
  RejectWorkspaceRequestNotificationSchema,
  SendWorkspaceJoinRequestNotificationSchema,
  AddMemberToBoardNotificationSchema,
  JoinBoardByLinkNotificationSchema,
  SendBoardJoinRequestNotificationSchema,
  ApproveBoardJoinRequestNotificationSchema,
  RejectBoardJoinRequestNotificationSchema,
  RemoveBoardMemberNotificationSchema,
  UpdateWorkspaceMemberRoleNotificationSchema,
  RemoveWorkspaceMemberNotificationSchema,
  RemoveWorkspaceGuestNotificationSchema
])
