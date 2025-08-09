import type { boardTypes } from "@/entities/board";
import type { workspaceTypes } from "@/entities/workspace";
import { BasePolicy } from "@/permissions/policies/base-policy";
import { PolicyContext } from "@/permissions/types/policy-context";
import { PolicyResult } from "@/permissions/types/policy-result";

export interface BoardRemoveMemberPolicyContext extends PolicyContext {
  targetMemberId: string // The member to be removed
}

export interface BoardRemoveMemberPolicyResource {
  workspaceOwnerId: workspaceTypes.Workspace['idOwner']
  boardMembers: boardTypes.Board['members']
}

/**
 * This policy is used for checking if a user can remove another member from a board.
 * For self-leave, use BoardLeavePolicy instead.
 */
export class BoardRemoveMemberPolicy extends BasePolicy {
  evaluate(
    context: BoardRemoveMemberPolicyContext, 
    resource: BoardRemoveMemberPolicyResource
  ): PolicyResult {
    const { targetMemberId } = context

    // Cannot remove yourself - use BoardLeavePolicy instead
    if (targetMemberId === context.user.id) {
      return this.deny('BOARD_MEMBER_REMOVAL::DENIED_USE_LEAVE_POLICY_FOR_SELF')
    }

    // Check if target member exists on the board
    const targetMember = this.getTargetMember(resource, targetMemberId)
    if (!targetMember) {
      return this.deny('BOARD_MEMBER_REMOVAL::DENIED_TARGET_MEMBER_NOT_FOUND')
    }

    // Check if current user has permission to remove members
    if (!this.canRemoveMember(context, resource)) {
      return this.deny('BOARD_MEMBER_REMOVAL::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Cannot remove workspace owner
    if (targetMemberId === resource.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_WORKSPACE_OWNER')
    }

    // Check role hierarchy - cannot remove equal or higher role (unless workspace owner)
    if (!this.canRemoveTargetRole(context, resource, targetMember)) {
      return this.deny('BOARD_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_EQUAL_OR_HIGHER_ROLE')
    }

    // If removing an admin, ensure at least one admin remains
    if (targetMember.boardMemberRole === 'Admin') {
      return this.evaluateAdminRemoval(resource)
    }

    return this.allow('BOARD_MEMBER_REMOVAL::ALLOWED_REMOVAL')
  }

  /**
   * Check if removing an admin would violate admin requirements
   */
  private evaluateAdminRemoval(resource: BoardRemoveMemberPolicyResource): PolicyResult {
    const adminCount = this.getAdminCount(resource.boardMembers)
    
    // Cannot remove if they are the only admin
    if (adminCount <= 1) {
      return this.deny('BOARD_MEMBER_REMOVAL::REQUIRED_AT_LEAST_ONE_ADMIN')
    }

    return this.allow('BOARD_MEMBER_REMOVAL::ALLOWED_ADMIN_REMOVAL')
  }

  /**
   * Check if current user has permission to remove members
   * Must be Admin or Workspace Owner
   */
  private canRemoveMember(
    context: BoardRemoveMemberPolicyContext,
    resource: BoardRemoveMemberPolicyResource
  ): boolean {
    return this.isAdminMember(context, resource) || this.isWorkspaceOwner(context, resource)
  }

  /**
   * Check if current user can remove the target member based on role hierarchy
   */
  private canRemoveTargetRole(
    context: BoardRemoveMemberPolicyContext,
    resource: BoardRemoveMemberPolicyResource,
    targetMember: boardTypes.Board['members'][0]
  ): boolean {
    // Workspace owner can remove anyone (except themselves, checked earlier)
    if (this.isWorkspaceOwner(context, resource)) {
      return true
    }

    const currentUserRole = this.getCurrentUserRole(context, resource)
    const targetRole = targetMember.boardMemberRole
    
    const currentUserHierarchy = this.getRoleHierarchy(currentUserRole)
    const targetHierarchy = this.getRoleHierarchy(targetRole)

    // Can only remove lower role members
    return targetHierarchy < currentUserHierarchy
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(
    context: BoardRemoveMemberPolicyContext,
    resource: BoardRemoveMemberPolicyResource
  ): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Check if the current user is an admin member
   */
  private isAdminMember(
    context: BoardRemoveMemberPolicyContext,
    resource: BoardRemoveMemberPolicyResource
  ): boolean {
    const { user } = context
    const { boardMembers } = resource
    return boardMembers.some(
      member => member.boardMemberRole === 'Admin' && member.memberId === user.id
    )
  }

  /**
   * Get target member to be removed
   */
  private getTargetMember(
    resource: BoardRemoveMemberPolicyResource,
    targetMemberId: string
  ): boardTypes.Board['members'][0] | undefined {
    return resource.boardMembers.find(member => member.memberId === targetMemberId)
  }

  /**
   * Get current user's role on the board
   */
  private getCurrentUserRole(
    context: BoardRemoveMemberPolicyContext,
    resource: BoardRemoveMemberPolicyResource
  ): boardTypes.BoardMemberRole | undefined {
    return resource.boardMembers.find(member => member.memberId === context.user.id)?.boardMemberRole
  }

  /**
   * Count total number of admins in the board
   */
  private getAdminCount(boardMembers: boardTypes.Board['members']): number {
    return boardMembers.filter(member => member.boardMemberRole === 'Admin').length
  }

  /**
   * Get role hierarchy value for comparison
   */
  private getRoleHierarchy(role?: boardTypes.BoardMemberRole): number {
    if (!role) {
      return 0
    }

    const hierarchy = {
      Observer: 1,
      Member: 2,
      Admin: 3
    }
  
    return hierarchy[role] || 0
  }
}