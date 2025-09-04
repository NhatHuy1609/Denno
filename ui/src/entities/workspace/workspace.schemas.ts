import { Board } from '../board/board.schemas'
import { User } from '../user/user.schemas'

export type WorkspaceVisibility = 'Public' | 'Private'
export type WorkspaceMemberType = 'Normal' | 'Admin'

export interface WorkspaceJoinRequest {
  id: number
  requestedAt: string
  workspaceId: string
  requester: {
    id: string
    avatar: string
    name: string
    email: string
  }
}

export interface Workspace {
  id: string // UUID format
  name: string
  description: string
  idOwner: string
  logo: string | null
  visibility: WorkspaceVisibility
  boardCounts?: {
    idMember: string
    boardCount: number
  }[]
  members: {
    id: string
    email: string
    avatar: string
    fullName: string
    memberType: WorkspaceMemberType
  }[]
  joinRequests: WorkspaceJoinRequest[]
  guests: {
    user: Pick<User, 'id' | 'fullName' | 'email' | 'avatar'>
    joinedBoards: Pick<Board, 'id' | 'name' | 'background'>[]
  }[]
}

export type Workspaces = Workspace[]

export interface WorkspaceFilterQuery {
  fields?: string
  boardCounts?: boolean
  members?: boolean
  joinRequests?: boolean
  memberFields?: string
  includeGuests?: boolean
}

export interface DetailedWorkspaceInvitation {
  inviter: Pick<User, 'id' | 'fullName' | 'email'>
  workspace: Pick<Workspace, 'id' | 'name'>
}

export interface WorkspaceJoinRequestDetail {
  id: number
  requestedAt: string
  workspaceId: string
  requester: Pick<User, 'id' | 'email' | 'avatar'> & { name: string }
}

export type WorkspaceJoinRequests = WorkspaceJoinRequestDetail[]
