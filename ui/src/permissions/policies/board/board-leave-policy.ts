import type { boardSchemas } from '@/entities/board'
import type { workspaceSchemas } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface BoardLeavePolicyContext extends PolicyContext {
  // No additional context needed - user wants to leave the board
}

export interface BoardLeavePolicyResource {
  workspaceOwnerId: workspaceSchemas.Workspace['idOwner']
  boardMembers: boardSchemas.Board['members']
}

/**
 * This policy is used for checking if a user can leave a board by themselves.
 */
export class BoardLeavePolicy extends BasePolicy {
  evaluate(context: BoardLeavePolicyContext, resource: BoardLeavePolicyResource): PolicyResult {
    // Check if user is actually a member of the board
    const currentMember = this.getCurrentMember(context, resource)
    if (!currentMember) {
      return this.deny('BOARD_MEMBER::DENIED_USER_NOT_MEMBER')
    }

    // Get current user's role
    const currentUserRole = currentMember.boardMemberRole

    // Workspace owner cannot leave their own workspace boards
    if (this.isWorkspaceOwner(context, resource)) {
      return this.deny('BOARD_MEMBER::DENIED_WORKSPACE_OWNER_CANNOT_LEAVE')
    }

    // If user is an admin, check if they can leave without breaking admin requirements
    if (currentUserRole === 'Admin') {
      return this.evaluateAdminLeave(context, resource)
    }

    // Regular members and observers can leave freely
    return this.allow('POLICY::ALLOWED')
  }

  /**
   * Evaluate if an admin can leave the board
   */
  private evaluateAdminLeave(context: BoardLeavePolicyContext, resource: BoardLeavePolicyResource): PolicyResult {
    const adminCount = this.getAdminCount(resource.boardMembers)

    // Cannot leave if they are the only admin
    if (adminCount <= 1) {
      return this.deny('BOARD_MEMBER::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }

    // Check if there will be at least one other admin who is not the workspace owner
    // (in case the workspace owner also wants to step down later)
    const otherAdmins = resource.boardMembers.filter(
      (member) => member.boardMemberRole === 'Admin' && member.memberId !== context.user.id
    )

    if (otherAdmins.length === 0) {
      return this.deny('BOARD_MEMBER::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }

    // Admin can leave if there are other admins
    return this.allow('POLICY::ALLOWED')
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(context: BoardLeavePolicyContext, resource: BoardLeavePolicyResource): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Get the current user as a board member
   */
  private getCurrentMember(
    context: BoardLeavePolicyContext,
    resource: BoardLeavePolicyResource
  ): boardSchemas.Board['members'][0] | undefined {
    return resource.boardMembers.find((member) => member.memberId === context.user.id)
  }

  /**
   * Count total number of admins in the board
   */
  private getAdminCount(boardMembers: boardSchemas.Board['members']): number {
    return boardMembers.filter((member) => member.boardMemberRole === 'Admin').length
  }

  /**
   * Get all admin members except the current user
   */
  private getOtherAdmins(
    context: BoardLeavePolicyContext,
    boardMembers: boardSchemas.Board['members']
  ): boardSchemas.Board['members'] {
    return boardMembers.filter((member) => member.boardMemberRole === 'Admin' && member.memberId !== context.user.id)
  }

  /**
   * Check if the current user is a board admin
   */
  private isCurrentUserAdmin(context: BoardLeavePolicyContext, resource: BoardLeavePolicyResource): boolean {
    const currentMember = this.getCurrentMember(context, resource)
    return currentMember?.boardMemberRole === 'Admin'
  }
}
