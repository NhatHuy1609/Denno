import { PolicyRegistry } from './core/policy-registry'
import { BoardViewPolicy } from './policies/board/board-view-policy'
import { BoardAssignMemberRolePolicy } from './policies/board/board-assign-member-role.policy'

export function initializePolicies() {
  try {
    PolicyRegistry.register('board', 'view', new BoardViewPolicy())
    PolicyRegistry.register('board', 'board_assign_member_role', new BoardAssignMemberRolePolicy())

    console.log('✅ Policies registered successfully.')
  } catch (error) {
    console.error('❌ Failed to initialize policies:', error)
  }
}

initializePolicies()
