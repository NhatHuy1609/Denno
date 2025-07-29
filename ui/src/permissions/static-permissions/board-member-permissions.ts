import type { boardTypes } from "@/entities/board"

type BoardMemberRole = boardTypes.BoardMemberRole

export interface StaticBoardMemberPermissionsSet {
  canEditBoard: boolean
  canShareBoard: boolean
  canManageBoardJoinRequests: boolean
}

export const BoardMemberPermissions: Record<BoardMemberRole, StaticBoardMemberPermissionsSet> = {
  'Admin': {
    canEditBoard: true,
    canShareBoard: true,
    canManageBoardJoinRequests: true
  },
  'Member': {
    canEditBoard: false,
    canShareBoard: true,
    canManageBoardJoinRequests: false
  },
  'Observer': {
    canEditBoard: false,
    canShareBoard: false,
    canManageBoardJoinRequests: false
  }
}
