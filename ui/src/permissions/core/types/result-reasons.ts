// 1. ReasonType
export type ReasonType =
  | 'ALLOWED'
  | 'DENIED'
  | 'LIMIT'
  | 'MISSING'
  | 'INVALID'
  | 'REQUIRED'

// 2. ReasonCode
// This code will have format: [RESOURCE]::[REASON_TYPE]_[DETAIL]
export type PolicyReasonCode =
  | 'POLICY::DENIED_NOT_FOUND'
  | 'GLOBAL::MISSING_AUTHENTICATION_OR_BOARD'
    // Board
  | 'BOARD::ALLOWED_IS_PUBLIC'
  | 'BOARD::ALLOWED_IS_WORKSPACE_LEVEL'
  | 'BOARD::ALLOWED_IS_PRIVATE'
  | 'BOARD::DENIED_USER_NOT_IN_BOARD_OR_WORKSPACE'
  | 'BOARD::DENIED_USER_NOT_IN_BOARD_OR_NOT_WORKSPACE_ADMIN'
  | 'BOARD::INVALID_VISIBILITY'
    // Board's member
  | 'BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION'
  | 'BOARD_MEMBER_ROLE::ALLOWED_MEMBER_LEVEL_ASSIGNABLE'
  | 'BOARD_MEMBER_ROLE::ALLOWED_ADMIN_LEVEL_ASSIGNABLE'
  | 'BOARD_MEMBER_ROLE::ALLOWED_OBSERVER_LEVEL_ASSIGNABLE'
  | 'BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN'
  | 'BOARD_MEMBER_ROLE::REQUIRED_ADMIN_LEVEL'
  | 'BOARD_MEMBER_ROLE::REQUIRED_HIGHER_LEVEL_ASSIGNABLE'
  | 'BOARD_MEMBER_ROLE::INVALID_ROLE'

// 3. Reason messages
export const PolicyReasonMessages: Record<PolicyReasonCode, string> = {
  'POLICY::DENIED_NOT_FOUND': 'No policy found for this action.',
  'GLOBAL::MISSING_AUTHENTICATION_OR_BOARD': 'User not authenticated or board not found.',
  // Board
  'BOARD::ALLOWED_IS_PUBLIC': 'Board is public.',
  'BOARD::ALLOWED_IS_WORKSPACE_LEVEL': 'User has workspace-level access.',
  'BOARD::ALLOWED_IS_PRIVATE': 'User has private board access.',
  'BOARD::DENIED_USER_NOT_IN_BOARD_OR_WORKSPACE': 'User is not a member of the board or workspace.',
  'BOARD::DENIED_USER_NOT_IN_BOARD_OR_NOT_WORKSPACE_ADMIN': 'User is not a member of the board or not a workspace admin.',
  'BOARD::INVALID_VISIBILITY': 'Unknown board visibility type.',
  // Board's member
  'BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION': 'You do not have permission to assign member roles.',
  'BOARD_MEMBER_ROLE::ALLOWED_MEMBER_LEVEL_ASSIGNABLE': 'Member level is assignable.',
  'BOARD_MEMBER_ROLE::ALLOWED_ADMIN_LEVEL_ASSIGNABLE': 'Admin level is assignable.',
  'BOARD_MEMBER_ROLE::ALLOWED_OBSERVER_LEVEL_ASSIGNABLE': 'Observer level is assignable.',
  'BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN': 'At least one other admin is required.',
  'BOARD_MEMBER_ROLE::REQUIRED_ADMIN_LEVEL': 'You must be a board admin to assign member roles.',
  'BOARD_MEMBER_ROLE::REQUIRED_HIGHER_LEVEL_ASSIGNABLE': 'You can only assign roles lower than your own.',
  'BOARD_MEMBER_ROLE::INVALID_ROLE': 'The selected role is invalid or not recognized.'
}

export type PolicyReason = {
  code: PolicyReasonCode
  message: string
}