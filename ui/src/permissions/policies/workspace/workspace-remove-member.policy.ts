import type { workspaceSchemas } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface WorkspaceRemoveMemberPolicyContext extends PolicyContext {
  targetMemberId: string
}

export interface WorkspaceRemoveMemberPolicyResource {
  workspaceOwnerId: workspaceSchemas.Workspace['idOwner']
  workspaceMembers: workspaceSchemas.Workspace['members']
}

/**
 * This policy is used for checking if a user can remove another member from a workspace.
 * For self-leave, use WorkspaceLeavePolicy instead.
 */
export class WorkspaceRemoveMemberPolicy extends BasePolicy {
  evaluate(context: WorkspaceRemoveMemberPolicyContext, resource: WorkspaceRemoveMemberPolicyResource): PolicyResult {
    const { targetMemberId } = context

    // Cannot remove yourself - use WorkspaceLeavePolicy instead
    if (targetMemberId === context.user.id) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::DENIED_USE_LEAVE_POLICY_FOR_SELF')
    }

    // Check if target member exists in the workspace
    const targetMember = this.getTargetMember(resource, targetMemberId)
    if (!targetMember) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::DENIED_TARGET_MEMBER_NOT_FOUND')
    }

    // Check if current user has permission to remove members
    if (!this.canRemoveMember(context, resource)) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::DENIED_INSUFFICIENT_PERMISSION')
    }

    // Cannot remove workspace owner
    if (targetMemberId === resource.workspaceOwnerId) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_WORKSPACE_OWNER')
    }

    // Check role hierarchy - cannot remove equal or higher role (unless workspace owner)
    if (!this.canRemoveTargetRole(context, resource, targetMember)) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::DENIED_CANNOT_REMOVE_EQUAL_OR_HIGHER_ROLE')
    }

    // If removing an admin, ensure at least one admin remains
    if (targetMember.memberType === 'Admin') {
      return this.evaluateAdminRemoval(resource)
    }

    return this.allow('WORKSPACE_MEMBER_REMOVAL::ALLOWED_REMOVAL')
  }

  /**
   * Check if removing an admin would violate admin requirements
   */
  private evaluateAdminRemoval(resource: WorkspaceRemoveMemberPolicyResource): PolicyResult {
    const adminCount = this.getAdminCount(resource.workspaceMembers)

    // Cannot remove if they are the only admin
    if (adminCount <= 1) {
      return this.deny('WORKSPACE_MEMBER_REMOVAL::REQUIRED_AT_LEAST_ONE_ADMIN')
    }

    return this.allow('WORKSPACE_MEMBER_REMOVAL::ALLOWED_ADMIN_REMOVAL')
  }

  /**
   * Check if current user has permission to remove members
   * Must be Admin or Workspace Owner
   */
  private canRemoveMember(
    context: WorkspaceRemoveMemberPolicyContext,
    resource: WorkspaceRemoveMemberPolicyResource
  ): boolean {
    return this.isAdminMember(context, resource) || this.isWorkspaceOwner(context, resource)
  }

  /**
   * Check if current user can remove the target member based on role hierarchy
   */
  private canRemoveTargetRole(
    context: WorkspaceRemoveMemberPolicyContext,
    resource: WorkspaceRemoveMemberPolicyResource,
    targetMember: workspaceSchemas.Workspace['members'][0]
  ): boolean {
    // Workspace owner can remove anyone (except themselves, checked earlier)
    if (this.isWorkspaceOwner(context, resource)) {
      return true
    }

    const currentUserRole = this.getCurrentUserRole(context, resource)
    const targetRole = targetMember.memberType

    const currentUserHierarchy = this.getRoleHierarchy(currentUserRole)
    const targetHierarchy = this.getRoleHierarchy(targetRole)

    // Can only remove lower role members
    return targetHierarchy < currentUserHierarchy
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(
    context: WorkspaceRemoveMemberPolicyContext,
    resource: WorkspaceRemoveMemberPolicyResource
  ): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Check if the current user is an admin member
   */
  private isAdminMember(
    context: WorkspaceRemoveMemberPolicyContext,
    resource: WorkspaceRemoveMemberPolicyResource
  ): boolean {
    const { user } = context
    const { workspaceMembers } = resource
    return workspaceMembers.some((member) => member.memberType === 'Admin' && member.id === user.id)
  }

  /**
   * Get target member to be removed
   */
  private getTargetMember(
    resource: WorkspaceRemoveMemberPolicyResource,
    targetMemberId: string
  ): workspaceSchemas.Workspace['members'][0] | undefined {
    return resource.workspaceMembers.find((member) => member.id === targetMemberId)
  }

  /**
   * Get current user's role in the workspace
   */
  private getCurrentUserRole(
    context: WorkspaceRemoveMemberPolicyContext,
    resource: WorkspaceRemoveMemberPolicyResource
  ): workspaceSchemas.WorkspaceMemberType | undefined {
    return resource.workspaceMembers.find((member) => member.id === context.user.id)?.memberType
  }

  /**
   * Count total number of admins in the workspace
   */
  private getAdminCount(workspaceMembers: workspaceSchemas.Workspace['members']): number {
    return workspaceMembers.filter((member) => member.memberType === 'Admin').length
  }

  /**
   * Get role hierarchy value for comparison
   * Workspace Owner is handled separately, so only Normal and Admin are compared here
   */
  private getRoleHierarchy(role?: workspaceSchemas.WorkspaceMemberType): number {
    if (!role) {
      return 0
    }

    const hierarchy = {
      Normal: 1,
      Admin: 2
    }

    return hierarchy[role] || 0
  }
}
