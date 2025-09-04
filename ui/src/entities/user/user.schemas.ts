export interface UserVisibilitySettings {
  id: string | null
  fullNameVisibility: string
  jobTitleVisibility: string
  departmentVisibility: string
  organizationVisibility: string
  basedInVisibility: string
  emailVisibility: string
  avatarVisibility: string
}

export interface User {
  id: string
  email: string
  avatar: string
  fullName: string
  userName: string | null
  jobTitle: string | null
  department: string | null
  basedIn: string | null
  organization: string | null
  coverImage: string | null
  userVisibilitySettings: UserVisibilitySettings | null
}

export interface Users {
  users: User[]
  pageSize: number
  pageNumber: number
  totalCount: number
  totalPages: number
}

export interface UserWorkspace {
  id: string
  name: string
  logo: string | null
}

export type UserWorkspaces = UserWorkspace[]

// Query model
export interface UsersFilterQuery {
  name?: string
  email?: string
  pageSize?: number
  pageNumber?: number
}

export interface UserWorkspacesFilterQuery {
  filter: 'none' | 'members' | 'public' | 'all'
  fields?: Array<'id' | 'name' | 'logo'>
}

export interface UserJoinedBoardsFilterQuery {
  workspaceId?: string
}

export interface UserBoardsQuery {
  starredBoards: boolean
}
