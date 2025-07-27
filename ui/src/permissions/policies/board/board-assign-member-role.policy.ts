import type { boardTypes } from "@/entities/board";
import type { PolicyContext, PolicyResult } from "@/permissions/core/types";
import type { workspaceTypes } from "@/entities/workspace";
import { BasePolicy } from "@/permissions/core/base-policy";

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

    if (!this.isAdminMember(context)) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    if (!this.isValidRole(targetRole)) {
      return this.deny('BOARD_MEMBER_ROLE::INVALID_ROLE')
    }

    const targetMember = this.getTargetMember(context, targetMemberId)
    if (!targetMember) {
      return this.deny('BOARD_MEMBER_ROLE::TARGET_MEMBER_NOT_FOUND')
    }

    if (targetMemberId === context.workspaceOwnerId && context.user.id !== context.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::WORKSPACE_OWNER_MUST_BE_ADMIN')
    }

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
    
    // Admin không thể tự hạ cấp nếu là admin duy nhất
    if (currentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(context.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner không thể tự hạ cấp xuống dưới Admin
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
    const targetNewHierarchy = this.getRoleHierarchy(targetRole)

    // Không thể thay đổi role của người có cấp bậc bằng hoặc cao hơn mình
    if (targetCurrentHierarchy >= currentUserHierarchy) {
      return this.deny('BOARD_MEMBER_ROLE::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Kiểm tra đặc biệt cho việc hạ cấp admin
    if (targetCurrentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(context.boardMembers)
      if (adminCount <= 1) {
        return this.deny('BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN')
      }
    }

    // Workspace owner chỉ có thể được thay đổi bởi chính họ
    if (targetMember.memberId === context.workspaceOwnerId) {
      return this.deny('BOARD_MEMBER_ROLE::CANNOT_MODIFY_WORKSPACE_OWNER_ROLE')
    }

    return this.allow('BOARD_MEMBER_ROLE::ROLE_CHANGE_ALLOWED')
  }

  private isAdminMember(context: BoardAssignMemberRolePolicyContext) {
    const { user, boardMembers } = context
    return boardMembers.find(
      member => member.boardMemberRole === 'Admin' && member.memberId === user.id
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

