import type { boardTypes } from "@/entities/board"

type BoardMemberRole = boardTypes.BoardMemberRole

export interface StaticBoardMemberPermissionsSet {
  canEditBoard: boolean
  canShareBoard: boolean
  canLeaveBoard: boolean
  canAssignBoardMemberRole: boolean
  canManageBoardJoinRequests: boolean
}

// Those are the permissions that a board member has based on their role
// and they are static permissions, if a permission is dynamic, complex logic -> use policy
export const StaticBoardMemberPermissions: Record<BoardMemberRole, StaticBoardMemberPermissionsSet> = {
  'Admin': {
    canEditBoard: true,
    canShareBoard: true,
    canLeaveBoard: true,
    canAssignBoardMemberRole: true,
    canManageBoardJoinRequests: true
  },
  'Member': {
    canEditBoard: false,
    canShareBoard: true,
    canLeaveBoard: true,
    canAssignBoardMemberRole: false,
    canManageBoardJoinRequests: false
  },
  'Observer': {
    canEditBoard: false,
    canShareBoard: false,
    canLeaveBoard: false,
    canAssignBoardMemberRole: false,
    canManageBoardJoinRequests: false
  }
}

export function getStaticBoardMemberPermissions(role: BoardMemberRole) {
  return StaticBoardMemberPermissions[role]
}
