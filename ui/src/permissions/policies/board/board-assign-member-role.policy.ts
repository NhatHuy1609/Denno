import type { boardTypes } from "@/entities/board";
import type { PolicyContext, PolicyResult } from "@/permissions/core/types";
import type { workspaceTypes } from "@/entities/workspace";
import { BasePolicy } from "@/permissions/core/base-policy";

export interface BoardAssignMemberRolePolicyContext extends PolicyContext {
  workspaceOwnerId: workspaceTypes.Workspace['idOwner']
  boardMembers: boardTypes.Board['members']
}

export interface BoardAssignMemberRolePolicyResource {
  targetRole?: boardTypes.BoardMemberRole
  targetMemberId: string
}

export class BoardAssignMemberRolePolicy extends BasePolicy {
  evaluate(
    context: BoardAssignMemberRolePolicyContext, 
    resource: BoardAssignMemberRolePolicyResource
  ): PolicyResult {
    const { targetRole } = resource || {}

    if (!this.isAdminMember(context)) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    if (targetRole === 'Member') {
      return this.evaluateAssignMemberRole(context, resource)
    }

    if (targetRole === 'Admin') {
      return this.evaluateAssignAdminRole(context)
    }

    if (targetRole === 'Observer') {
      return this.evaluateAssignObserverRole(context, resource)
    }

    return this.deny('BOARD_MEMBER_ROLE::INVALID_ROLE')
  }

  private isAdminMember(context: BoardAssignMemberRolePolicyContext) {
    const { user, boardMembers } = context
    return boardMembers.some(
      member => member.boardMemberRole === 'Admin' &&
      member.memberId === user.id
    )
  }

  evaluateAssignObserverRole(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource  
  ): PolicyResult {
    
    const { boardMembers, workspaceOwnerId } = context
    const { targetMemberId } = resource
    
    const boardAdmins = boardMembers.filter(member => member.boardMemberRole === 'Admin')
    // If board only has 1 admin
    if (boardAdmins.length < 2) {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }

    if (targetMemberId === workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    return this.allow('BOARD_MEMBER_ROLE::ALLOWED_OBSERVER_LEVEL_ASSIGNABLE')
  }

  private evaluateAssignAdminRole(
    context: BoardAssignMemberRolePolicyContext,
  ): PolicyResult {
    const { user, boardMembers } = context
    const currentUserRole = boardMembers.find(member => member.memberId === user.id)?.boardMemberRole
    const currentUserRoleHierarchy = this.getRoleHierarchy(currentUserRole)

    if (currentUserRoleHierarchy < 3) {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_ADMIN_LEVEL')
    }

    return this.allow('BOARD_MEMBER_ROLE::ALLOWED_ADMIN_LEVEL_ASSIGNABLE')
  }

  private evaluateAssignMemberRole(
    context: BoardAssignMemberRolePolicyContext,
    resource: BoardAssignMemberRolePolicyResource
  ): PolicyResult {
    const { user, boardMembers } = context
    const { targetRole } = resource
    const currentUserRole = boardMembers.find(member => member.memberId === user.id)?.boardMemberRole
    
    const boardAdmins = boardMembers.filter(member => member.boardMemberRole === 'Admin')
    // If board only has 1 admin
    if (boardAdmins.length < 2) {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
    }
    
    const targetRoleHierarchy = this.getRoleHierarchy(targetRole)
    const currentUserRoleHierarchy = this.getRoleHierarchy(currentUserRole)
    // If current user doesn't have higher role than target role
    if (currentUserRoleHierarchy < targetRoleHierarchy) {
      return this.deny('BOARD_MEMBER_ROLE::REQUIRED_HIGHER_LEVEL_ASSIGNABLE')
    }

    return this.allow('BOARD_MEMBER_ROLE::ALLOWED_MEMBER_LEVEL_ASSIGNABLE')
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

