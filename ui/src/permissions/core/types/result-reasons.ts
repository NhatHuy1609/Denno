export type PolicyReasonCode =
  | 'POLICY::NOT_FOUND'
  | 'GLOBAL::NOT_AUTHENTICATED_OR_MISSING_BOARD'
  | 'BOARD::IS_PUBLIC'
  | 'BOARD::IS_WORKSPACE_LEVEL'
  | 'BOARD::IS_PRIVATE'
  | 'BOARD::USER_NOT_IN_BOARD_OR_WORKSPACE'
  | 'BOARD::USER_NOT_IN_BOARD_OR_NOT_WORKSPACE_ADMIN'
  | 'BOARD::UNKNOWN_VISIBILITY'
  
export const PolicyReasonMessages: Record<PolicyReasonCode, string> = {
  'POLICY::NOT_FOUND': 'No policy found for this action.',
  'GLOBAL::NOT_AUTHENTICATED_OR_MISSING_BOARD': 'User not authenticated or board not found.',
  'BOARD::IS_PUBLIC': 'Board is public.',
  'BOARD::IS_WORKSPACE_LEVEL': 'User has workspace-level access.',
  'BOARD::IS_PRIVATE': 'User has private board access.',
  'BOARD::USER_NOT_IN_BOARD_OR_WORKSPACE': 'User is not a member of the board or workspace.',
  'BOARD::USER_NOT_IN_BOARD_OR_NOT_WORKSPACE_ADMIN': 'User is not a member of the board or workspace admin.',
  'BOARD::UNKNOWN_VISIBILITY': 'Unknown board visibility type.'
}

export type PolicyReason = {
  code: PolicyReasonCode
  message: string
}