import type { boardTypes } from '@/entities/board'
import type { workspaceTypes } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface BoardAssignMemberRolePolicyContext extends PolicyContext {
  targetRole: boardTypes.BoardMemberRole
  targetMemberId: string
}

export interface BoardAssignMemberRolePolicyResource {
  workspaceOwnerId: workspaceTypes.Workspace['idOwner']
  boardMembers: boardTypes.Board['members']
}

/**
 * This policy is used for checking if the user (assigner) can assign a role to a target board member.
 */
export class BoardAssignMemberRolePolicy extends BasePolicy {
  evaluate(context: BoardAssignMemberRolePolicyContext, resource: BoardAssignMemberRolePolicyResource): PolicyResult {
    const { targetRole, targetMemberId } = context || {}

    // Check permission: must be Admin or Workspace Owner
    if (!this.canAssignRole(context, resource)) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Check if target role is valid
    if (!this.isValidRole(targetRole)) {
      return this.deny('BOARD_MEMBER_ROLE::INVALID_ROLE')
    }

    // Get target member info
    const targetMember = this.getTargetMember(resource, targetMemberId)
    if (!targetMember) {
      return this.deny('BOARD_MEMBER_ROLE::TARGET_MEMBER_NOT_FOUND')
    }

    // If the target is the workspace owner – only the owner can modify their own role
    if (targetMemberId === resource.workspaceOwnerId && context.user.id !== resource.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::WORKSPACE_OWNER_MUST_BE_ADMIN')
    }

    // Distinguish between self-role change and modifying others' roles
    if (targetMemberId === context.user.id) {
      return this.evaluateSelfRoleChange(context, resource, targetMember, targetRole)
    }

    return this.evaluateOtherMemberRoleChange(context, resource, targetMember, targetRole)
  }

  private evaluateSelfRoleChange(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource,
    targetMember: boardTypes.Board['members'][0],
    targetRole: boardTypes.BoardMemberRole
  ): PolicyResult {
    const currentRole = targetMember.boardMemberRole

    // Admin cannot demote themselves if they are the only admin
    if (currentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(resource.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner must remain at least Admin
    if (context.user.id === resource.workspaceOwnerId && targetRole !== 'Admin') {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }

    return this.allow('BOARD_MEMBER_ROLE::SELF_ROLE_CHANGE_ALLOWED')
  }

  private evaluateOtherMemberRoleChange(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource,
    targetMember: boardTypes.Board['members'][0],
    targetRole: boardTypes.BoardMemberRole
  ): PolicyResult {
    const currentUserRole = this.getCurrentUserRole(context, resource)
    const targetCurrentRole = targetMember.boardMemberRole

    const isWorkspaceOwner = this.isWorkspaceOwner(context, resource)
    const currentUserHierarchy = this.getRoleHierarchy(currentUserRole, isWorkspaceOwner)
    const targetCurrentHierarchy = this.getRoleHierarchy(targetCurrentRole)

    // Cannot modify roles of members with equal or higher role
    if (targetCurrentHierarchy >= currentUserHierarchy) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Special case: demoting an admin
    if (targetCurrentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(resource.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner's role can only be changed by themselves
    if (targetMember.memberId === resource.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::CANNOT_MODIFY_WORKSPACE_OWNER_ROLE')
    }

    return this.allow('BOARD_MEMBER_ROLE::ROLE_CHANGE_ALLOWED')
  }

  /**
   * Check if the current user has permission to assign roles
   * (must be Admin or Workspace Owner)
   */
  private canAssignRole(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource
  ): boolean {
    return this.isAdminMember(context, resource) || this.isWorkspaceOwner(context, resource)
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource
  ): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Check if the current user is an admin member
   */
  private isAdminMember(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource
  ): boolean {
    const { user } = context
    const { boardMembers } = resource
    return boardMembers.some((member) => member.boardMemberRole === 'Admin' && member.memberId === user.id)
  }

  private getCurrentUserRole(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource
  ): boardTypes.BoardMemberRole | undefined {
    return resource.boardMembers.find((member) => member.memberId === context.user.id)?.boardMemberRole
  }

  private getAdminCount(boardMembers: boardTypes.Board['members']): number {
    return boardMembers.filter((member) => member.boardMemberRole === 'Admin').length
  }

  private getTargetMember(
    resource: BoardAssignMemberRolePolicyResource,
    targetMemberId: string
  ): boardTypes.Board['members'][0] | undefined {
    return resource.boardMembers.find((member) => member.memberId === targetMemberId)
  }

  private isValidRole(role: string): role is boardTypes.BoardMemberRole {
    return ['Observer', 'Member', 'Admin'].includes(role)
  }

  private getRoleHierarchy(role?: boardTypes.BoardMemberRole, isWorkspaceOwner: boolean = false): number {
    if (!role) {
      return 0
    }

    if (isWorkspaceOwner) {
      return 4
    }

    const hierarchy = {
      Observer: 1,
      Member: 2,
      Admin: 3
    }

    return hierarchy[role] || 0
  }
}
