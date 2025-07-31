export type CRUDAction = 'create' | 'read' | 'update' | 'delete'
export type UIAction = 'view'

export type BoardBusinessAction = 
  | 'board_assign_member_role'

export type PolicyAction =
  | CRUDAction
  | UIAction
  | BoardBusinessAction