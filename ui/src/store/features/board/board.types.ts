import { boardTypes } from '@/entities/board'
import { StaticBoardMemberPermissionsSet } from '@/permissions/static-permissions/board-member-permissions'

export type MemberRole = boardTypes.BoardMemberRole | null

export interface BoardState {
  id: string | null
  currentUserRole: MemberRole
  currentUserPermissions: StaticBoardMemberPermissionsSet | null
}
