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
  | 'POLICY::ALLOWED'
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
  | 'BOARD_MEMBER::DENIED_WORKSPACE_OWNER_CANNOT_LEAVE'
  | 'BOARD_MEMBER::DENIED_USER_NOT_MEMBER'
  | 'BOARD_MEMBER::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN'
    // Board's member role
  | 'BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION'
  | 'BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN'
  | 'BOARD_MEMBER_ROLE::INVALID_ROLE'
  | 'BOARD_MEMBER_ROLE::TARGET_MEMBER_NOT_FOUND'
  | 'BOARD_MEMBER_ROLE::WORKSPACE_OWNER_MUST_BE_ADMIN'
  | 'BOARD_MEMBER_ROLE::SELF_ROLE_CHANGE_ALLOWED'
  | 'BOARD_MEMBER_ROLE::ROLE_CHANGE_ALLOWED'
  | 'BOARD_MEMBER_ROLE::CANNOT_MODIFY_WORKSPACE_OWNER_ROLE'
  // Board's member removal - NEW
  | 'BOARD_MEMBER_REMOVAL::DENIED_USE_LEAVE_POLICY_FOR_SELF'
  | 'BOARD_MEMBER_REMOVAL::DENIED_TARGET_MEMBER_NOT_FOUND'
  | 'BOARD_MEMBER_REMOVAL::DENIED_INSUFFICIENT_PERMISSION'
  | 'BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_WORKSPACE_OWNER'
  | 'BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_EQUAL_OR_HIGHER_ROLE'
  | 'BOARD_MEMBER_REMOVAL::REQUIRED_AT_LEAST_ONE_ADMIN'
  | 'BOARD_MEMBER_REMOVAL::ALLOWED_REMOVAL'
  | 'BOARD_MEMBER_REMOVAL::ALLOWED_ADMIN_REMOVAL'

// 3. Reason messages
export const PolicyReasonMessages: Record<PolicyReasonCode, string> = {
  'POLICY::ALLOWED': 'Policy allowed.',
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
  'BOARD_MEMBER::DENIED_WORKSPACE_OWNER_CANNOT_LEAVE': 'Workspace owner cannot leave their own workspace boards.',
  'BOARD_MEMBER::DENIED_USER_NOT_MEMBER': 'User is not a member of the board.',
  'BOARD_MEMBER::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN': 'At least one other admin is required to leave.',
  // Board's member role
  'BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION': 'You do not have permission to assign member roles.',
  'BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN': 'At least one other admin is required.',
  'BOARD_MEMBER_ROLE::INVALID_ROLE': 'The selected role is invalid or not recognized.',
  'BOARD_MEMBER_ROLE::TARGET_MEMBER_NOT_FOUND': 'The target member was not found in the board.',
  'BOARD_MEMBER_ROLE::WORKSPACE_OWNER_MUST_BE_ADMIN': 'The workspace owner must be an admin.',
  'BOARD_MEMBER_ROLE::SELF_ROLE_CHANGE_ALLOWED': 'You can change your own role.',
  'BOARD_MEMBER_ROLE::ROLE_CHANGE_ALLOWED': 'Role change is allowed.',
  'BOARD_MEMBER_ROLE::CANNOT_MODIFY_WORKSPACE_OWNER_ROLE': 'You cannot modify the workspace owner role.',
  // Board's member removal
  'BOARD_MEMBER_REMOVAL::DENIED_USE_LEAVE_POLICY_FOR_SELF': 'Use BoardLeavePolicy to remove yourself from the board.',
  'BOARD_MEMBER_REMOVAL::DENIED_TARGET_MEMBER_NOT_FOUND': 'The target member was not found in the board.',
  'BOARD_MEMBER_REMOVAL::DENIED_INSUFFICIENT_PERMISSION': 'You do not have permission to remove board members.',
  'BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_WORKSPACE_OWNER': 'Cannot remove the workspace owner from the board.',
  'BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_EQUAL_OR_HIGHER_ROLE': 'You cannot remove members with equal or higher roles.',
  'BOARD_MEMBER_REMOVAL::REQUIRED_AT_LEAST_ONE_ADMIN': 'At least one admin must remain on the board.',
  'BOARD_MEMBER_REMOVAL::ALLOWED_REMOVAL': 'Member removal is allowed.',
  'BOARD_MEMBER_REMOVAL::ALLOWED_ADMIN_REMOVAL': 'Admin removal is allowed.',
}

export type PolicyReason = {
  code: PolicyReasonCode
  message: string
}