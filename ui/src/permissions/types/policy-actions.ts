export type CRUDAction = 'create' | 'read' | 'update' | 'delete'
export type UIAction = 'view'

export type BoardBusinessAction = 'board_assign_member_role' | 'board_remove_member' | 'board_leave'

export type WorkspaceBusinessAction =
  | 'workspace_assign_member_permission'
  | 'workspace_remove_member'
  | 'workspace_leave'

export type PolicyAction = CRUDAction | UIAction | BoardBusinessAction | WorkspaceBusinessAction
