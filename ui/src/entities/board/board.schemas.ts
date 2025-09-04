// board.types.ts
import { User } from '../user/user.schemas'
import { Workspace } from '../workspace/workspace.schemas'

export type BoardMemberRole = 'Member' | 'Admin' | 'Observer'
export type BoardVisibility = 'Private' | 'Workspace' | 'Public'

export interface Board {
  id: string
  name: string
  background: string
  starredStatus: boolean
  workspaceId: string
  visibility: BoardVisibility
  members: {
    memberId: string
    member: User
    boardMemberRole: BoardMemberRole
  }[]
  joinRequests: BoardJoinRequest[]
}

export type Boards = Board[]

// For invitation details
export interface DetailedBoardInvitation {
  inviter: {
    id: string
    fullName: string
    email: string
  }
  board: {
    id: string
    name: string
  }
}

// Join requests array type
export interface BoardJoinRequest {
  id: number
  boardId: string
  requestedAt: string
  requester: {
    id: string
    name: string
    email: string
    avatar: string
  }
}

export type BoardJoinRequests = BoardJoinRequest[]

// Query Filter
export type BoardQueryFilter = {
  includeBoardMembers?: boolean | undefined
  includeCardLists?: boolean | undefined
  includeBoardLabels?: boolean | undefined
  includeBoardRestrictions?: boolean | undefined
  includeActions?: boolean | undefined
  includeJoinRequests?: boolean | undefined
  includeBoardUserSettings?: boolean | undefined
  includeWorkspace?: boolean | undefined
}
