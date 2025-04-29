import { z } from 'zod'
import { GetUserResponseDtoSchema } from '../user/user.contracts';
import { ActionTypeSchema } from '../_constants/action-types';
import { AddedToWorkspaceDataSchema } from './models/added-to-workspace-data';
import { NotificationDisplaySchema } from './models/notification-display';
import { ApproveWorkspaceJoinRequestDataSchema } from './models/approve-workspace-join-request-data';
import { JoinWorkspaceByLinkDataSchema } from './models/join-workspace-by-link-data';
import { RejectWorkspaceJoinRequestDataSchema } from './models/reject-workspace-join-request';

const NotificationResponseDtoBaseSchema = z.object({
  id: z.number(),
  isRead: z.boolean(),
  type: ActionTypeSchema,
  date: z.string().datetime(),
  dateRead: z.string().datetime().nullable(),
  memberCreatorId: z.string(),
  actionId: z.string().uuid(),
  memberCreator: GetUserResponseDtoSchema
});

export const AddedToWorkspaceNotificationSchema  = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.addMemberToWorkspace),
  data: AddedToWorkspaceDataSchema,
  display: NotificationDisplaySchema
})

export const ApproveWorkspaceJoinRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.approveWorkspaceJoinRequest),
  data: ApproveWorkspaceJoinRequestDataSchema,
  display: NotificationDisplaySchema,
});

export const JoinWorkspaceByLinkNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal(ActionTypeSchema.Enum.joinWorkspaceByLink),
  data: JoinWorkspaceByLinkDataSchema,
  display: NotificationDisplaySchema,
});

export const RejectWorkspaceRequestNotificationSchema = NotificationResponseDtoBaseSchema.extend({
  type: z.literal("rejectWorkspaceJoinRequest"),
  data: RejectWorkspaceJoinRequestDataSchema,
  display: NotificationDisplaySchema,
});

export const NotificationResponseDtoSchema = z.discriminatedUnion('type', [
  AddedToWorkspaceNotificationSchema,
  ApproveWorkspaceJoinRequestNotificationSchema,
  JoinWorkspaceByLinkNotificationSchema,
  RejectWorkspaceRequestNotificationSchema,
])