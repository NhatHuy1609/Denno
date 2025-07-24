import { useEffect } from 'react'
import { PolicyRegistry } from './core/policy-registry'
import { BoardViewPolicy } from './policies/board/board-view-policy'
import { BoardAssignMemberRolePolicy } from './policies/board/board-assign-member-role.policy'

export const PolicyInitializer = () => {
  const initializePolicies = () => {
    console.log('Initializing policies...') // DEBUG

    PolicyRegistry.register('view:board', new BoardViewPolicy())
    PolicyRegistry.register('assign_role:board_member', new BoardAssignMemberRolePolicy())
  }

  useEffect(() => {
    initializePolicies()
  }, [])

  return null
}
