import type { workspaceSchemas } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface WorkspaceAssignMemberPermissionPolicyContext extends PolicyContext {
  targetRole: workspaceSchemas.WorkspaceMemberType
  targetMemberId: string
}

export interface WorkspaceAssignMemberPermissionPolicyResource {
  workspaceOwnerId: workspaceSchemas.Workspace['idOwner']
  workspaceMembers?: workspaceSchemas.Workspace['members']
}

/**
 * This policy is used for checking if the user (assigner) can assign a permission to a target workspace member.
 *
 * Role Policy for Workspace Members
 *
 * Valid Roles:
 * - Normal
 * - Admin
 * - Workspace Owner
 *
 * Role Hierarchy:
 * - Normal: 1
 * - Admin: 2
 * - Workspace Owner: 3 (highest)
 *
 * Rules:
 * 1. There must always be at least one Admin in the workspace.
 * 2. A member can only modify roles of members with a lower hierarchy.
 *    - Normal: cannot assign or modify any role.
 *    - Admin: can assign/modify roles of Normal members,
 *             but cannot modify other Admins or the Workspace Owner.
 *    - Workspace Owner: can modify all members,
 *             but must ensure at least one Admin remains in the workspace.
 */
export class WorkspaceAssignMemberPermissionPolicy extends BasePolicy {
  evaluate(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource
  ): PolicyResult {
    const { targetRole, targetMemberId } = context || {}

    // Check if workspace members exist
    if (!resource.workspaceMembers || !Array.isArray(resource.workspaceMembers)) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::MISSING_WORKSPACE_MEMBERS')
    }

    // Check permission: must be Admin or Workspace Owner
    if (!this.canAssignPermission(context, resource)) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Check if target role is valid
    if (!this.isValidRole(targetRole)) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::INVALID_ROLE')
    }

    // Get target member info
    const targetMember = this.getTargetMember(resource, targetMemberId)
    if (!targetMember) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::MISSING_TARGET_MEMBER')
    }

    // If the target is the workspace owner – only the owner can modify their own role
    if (targetMemberId === resource.workspaceOwnerId && context.user.id !== resource.workspaceOwnerId) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::DENIED_WORKSPACE_OWNER_MUST_BE_ADMIN')
    }

    // Distinguish between self-role change and modifying others' roles
    if (targetMemberId === context.user.id) {
      return this.evaluateSelfRoleChange(context, resource, targetMember, targetRole)
    }

    return this.evaluateOtherMemberRoleChange(context, resource, targetMember, targetRole)
  }

  private evaluateSelfRoleChange(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource,
    targetMember: workspaceSchemas.Workspace['members'][0],
    targetRole: workspaceSchemas.WorkspaceMemberType
  ): PolicyResult {
    const currentRole = targetMember.memberType

    // Admin cannot demote themselves if they are the only admin
    if (currentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(resource.workspaceMembers!)
      if (adminCount <= 1) {
        return this.deny('WORKSPACE_MEMBER_PERMISSION::REQUIRED_AT_LEAST_ONE_ADMIN')
      }
    }

    // Workspace owner must remain at least Admin
    if (context.user.id === resource.workspaceOwnerId && targetRole !== 'Admin') {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::DENIED_WORKSPACE_OWNER_MUST_BE_ADMIN')
    }

    return this.allow('WORKSPACE_MEMBER_PERMISSION::ALLOWED_SELF_ROLE_CHANGE')
  }

  private evaluateOtherMemberRoleChange(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource,
    targetMember: workspaceSchemas.Workspace['members'][0],
    targetRole: workspaceSchemas.WorkspaceMemberType
  ): PolicyResult {
    const currentUserRole = this.getCurrentUserRole(context, resource)
    const targetCurrentRole = targetMember.memberType

    const isWorkspaceOwner = this.isWorkspaceOwner(context, resource)
    const currentUserHierarchy = this.getRoleHierarchy(currentUserRole, isWorkspaceOwner)
    const targetCurrentHierarchy = this.getRoleHierarchy(targetCurrentRole)

    // Cannot modify roles of members with equal or higher role hierarchy
    if (targetCurrentHierarchy >= currentUserHierarchy) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Special case: demoting an admin
    if (targetCurrentRole === 'Admin' && targetRole !== 'Admin') {
      const adminCount = this.getAdminCount(resource.workspaceMembers!)
      if (adminCount <= 1) {
        return this.deny('WORKSPACE_MEMBER_PERMISSION::REQUIRED_AT_LEAST_ONE_ADMIN')
      }
    }

    // Workspace owner's role can only be changed by themselves
    if (targetMember.id === resource.workspaceOwnerId) {
      return this.deny('WORKSPACE_MEMBER_PERMISSION::DENIED_CANNOT_MODIFY_WORKSPACE_OWNER_ROLE')
    }

    return this.allow('WORKSPACE_MEMBER_PERMISSION::ALLOWED_ROLE_CHANGE')
  }

  /**
   * Check if the current user has permission to assign roles
   * (must be Admin or Workspace Owner)
   */
  private canAssignPermission(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource
  ): boolean {
    return this.isAdminMember(context, resource) || this.isWorkspaceOwner(context, resource)
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource
  ): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Check if the current user is an admin member
   */
  private isAdminMember(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource
  ): boolean {
    const { user } = context
    const { workspaceMembers } = resource
    if (!workspaceMembers) return false
    return workspaceMembers.some((member) => member.memberType === 'Admin' && member.id === user.id)
  }

  private getCurrentUserRole(
    context: WorkspaceAssignMemberPermissionPolicyContext,
    resource: WorkspaceAssignMemberPermissionPolicyResource
  ): workspaceSchemas.WorkspaceMemberType | undefined {
    if (!resource.workspaceMembers) return undefined
    return resource.workspaceMembers.find((member) => member.id === context.user.id)?.memberType
  }

  private getAdminCount(workspaceMembers: workspaceSchemas.Workspace['members']): number {
    if (!workspaceMembers) return 0
    return workspaceMembers.filter((member) => member.memberType === 'Admin').length
  }

  private getTargetMember(
    resource: WorkspaceAssignMemberPermissionPolicyResource,
    targetMemberId: string
  ): workspaceSchemas.Workspace['members'][0] | undefined {
    if (!resource.workspaceMembers) return undefined
    return resource.workspaceMembers.find((member) => member.id === targetMemberId)
  }

  private isValidRole(role: string): role is workspaceSchemas.WorkspaceMemberType {
    return ['Normal', 'Admin'].includes(role)
  }

  private getRoleHierarchy(role?: workspaceSchemas.WorkspaceMemberType, isWorkspaceOwner: boolean = false): number {
    if (!role) {
      return 0
    }

    if (isWorkspaceOwner) {
      return 3
    }

    const hierarchy = {
      Normal: 1,
      Admin: 2
    }

    return hierarchy[role] || 0
  }
}
