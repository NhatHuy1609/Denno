import { PolicyRegistry } from './core/policy-registry'
import { BoardViewPolicy } from './policies/board/board-view-policy'
import { BoardAssignMemberRolePolicy } from './policies/board/board-assign-member-role.policy'
import { BoardRemoveMemberPolicy } from './policies/board/board-remove-member.policy'
import { BoardLeavePolicy } from './policies/board/board-leave-policy'
import { WorkspaceAssignMemberPermissionPolicy } from './policies/workspace/workspace-assign-member-permission.policy'

export function initializePolicies() {
  try {
    // Board's policies
    PolicyRegistry.register('board', 'view', new BoardViewPolicy())
    PolicyRegistry.register('board', 'board_assign_member_role', new BoardAssignMemberRolePolicy())
    PolicyRegistry.register('board', 'board_remove_member', new BoardRemoveMemberPolicy())
    PolicyRegistry.register('board', 'board_leave', new BoardLeavePolicy())

    // Workspace's policies
    PolicyRegistry.register(
      'workspace',
      'workspace_assign_member_permission',
      new WorkspaceAssignMemberPermissionPolicy()
    )

    console.log('✅ Policies registered successfully.')
  } catch (error) {
    console.error('❌ Failed to initialize policies:', error)
  }
}

initializePolicies()
