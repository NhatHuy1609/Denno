import { z } from 'zod'

export const ActionTypeSchema = z.enum([
  'addMemberToWorkspace',
  'joinWorkspaceByLink',
  'approveWorkspaceJoinRequest',
  'rejectWorkspaceJoinRequest',
  'sendWorkspaceJoinRequest',
  'createBoard',
  'addMemberToBoard',
  'joinBoard',
  'joinBoardByLink',
  'sendBoardJoinRequest',
  'approveBoardJoinRequest',
  'rejectBoardJoinRequest',
  'updateBoardMemberRole',
  'removeBoardMember',
  'updateWorkspaceMemberRole',
  'removeWorkspaceMember',
  'removeWorkspaceGuest'
])

export type ActionType = z.infer<typeof ActionTypeSchema>
