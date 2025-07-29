import type { boardTypes } from "@/entities/board";
import type { workspaceTypes } from "@/entities/workspace";
import { BasePolicy } from "@/permissions/policies/base-policy";
import { PolicyContext } from "@/permissions/types/policy-context";
import { PolicyResult } from "@/permissions/types/policy-result";

export interface BoardAssignMemberRolePolicyContext extends PolicyContext {
  workspaceOwnerId: workspaceTypes.Workspace['idOwner']
  boardMembers: boardTypes.Board['members']
}

export interface BoardAssignMemberRolePolicyResource {
  targetRole: boardTypes.BoardMemberRole
  targetMemberId: string
}

export class BoardAssignMemberRolePolicy extends BasePolicy {
  evaluate(
    context: BoardAssignMemberRolePolicyContext, 
    resource: BoardAssignMemberRolePolicyResource
  ): PolicyResult {
    const { targetRole, targetMemberId } = resource || {}

    // Check permission: must be Admin or Workspace Owner
    if (!this.canAssignRole(context)) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Check if target role is valid
    if (!this.isValidRole(targetRole)) {
      return this.deny('BOARD_MEMBER_ROLE::INVALID_ROLE')
    }

    // Get target member info
    const targetMember = this.getTargetMember(context, targetMemberId)
    if (!targetMember) {
      return this.deny('BOARD_MEMBER_ROLE::TARGET_MEMBER_NOT_FOUND')
    }

    // If the target is the workspace owner – only the owner can modify their own role
    if (targetMemberId === context.workspaceOwnerId && context.user.id !== context.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::WORKSPACE_OWNER_MUST_BE_ADMIN')
    }

    // Distinguish between self-role change and modifying others' roles
    if (targetMemberId === context.user.id) {
      return this.evaluateSelfRoleChange(context, targetMember, targetRole)
    }

    return this.evaluateOtherMemberRoleChange(context, targetMember, targetRole)
  }

  private evaluateSelfRoleChange(
    context: BoardAssignMemberRolePolicyContext,
    targetMember: boardTypes.Board['members'][0],
    targetRole: boardTypes.BoardMemberRole
  ): PolicyResult {
    const currentRole = targetMember.boardMemberRole
    
    // Admin cannot demote themselves if they are the only admin
    if (currentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(context.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner must remain at least Admin
    if (context.user.id === context.workspaceOwnerId && targetRole !== 'Admin') {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }

    return this.allow('BOARD_MEMBER_ROLE::SELF_ROLE_CHANGE_ALLOWED')
  }

  private evaluateOtherMemberRoleChange(
    context: BoardAssignMemberRolePolicyContext,
    targetMember: boardTypes.Board['members'][0],
    targetRole: boardTypes.BoardMemberRole
  ): PolicyResult {
    const currentUserRole = this.getCurrentUserRole(context)
    const targetCurrentRole = targetMember.boardMemberRole
    
    const currentUserHierarchy = this.getRoleHierarchy(currentUserRole)
    const targetCurrentHierarchy = this.getRoleHierarchy(targetCurrentRole)

    // Cannot modify roles of members with equal or higher role
    if (targetCurrentHierarchy >= currentUserHierarchy) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Special case: demoting an admin
    if (targetCurrentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(context.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner's role can only be changed by themselves
    if (targetMember.memberId === context.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::CANNOT_MODIFY_WORKSPACE_OWNER_ROLE')
    }

    return this.allow('BOARD_MEMBER_ROLE::ROLE_CHANGE_ALLOWED')
  }

/**
   * Check if the current user has permission to assign roles
   * (must be Admin or Workspace Owner)
   */
  private canAssignRole(context: BoardAssignMemberRolePolicyContext): boolean {
    return this.isAdminMember(context) || this.isWorkspaceOwner(context)
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(context: BoardAssignMemberRolePolicyContext): boolean {
    return context.user.id === context.workspaceOwnerId
  }

  /**
   * Check if the current user is an admin member
   */
  private isAdminMember(context: BoardAssignMemberRolePolicyContext): boolean {
    const { user, boardMembers } = context
    return boardMembers.some(
      member => member.boardMemberRole === 'Admin' && member.memberId === user.id
    )
  }

  private getCurrentUserRole(context: BoardAssignMemberRolePolicyContext): boardTypes.BoardMemberRole | undefined {
    return context.boardMembers.find(member => member.memberId === context.user.id)?.boardMemberRole
  }

  private getAdminCount(boardMembers: boardTypes.Board['members']): number {
    return boardMembers.filter(member => member.boardMemberRole === 'Admin').length
  }

  private getTargetMember(
    context: BoardAssignMemberRolePolicyContext, 
    targetMemberId: string
  ): boardTypes.Board['members'][0] | undefined {
    return context.boardMembers.find(member => member.memberId === targetMemberId)
  }

  private isValidRole(role: string): role is boardTypes.BoardMemberRole {
    return ['Observer', 'Member', 'Admin'].includes(role)
  }
  
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

