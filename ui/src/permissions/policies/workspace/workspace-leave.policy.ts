import type { workspaceSchemas } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface WorkspaceLeavePolicyContext extends PolicyContext {
  // No additional context needed - user wants to leave the workspace
}

export interface WorkspaceLeavePolicyResource {
  workspaceOwnerId: workspaceSchemas.Workspace['idOwner']
  workspaceMembers: workspaceSchemas.Workspace['members']
}

/**
 * This policy is used for checking if a user can leave a workspace by themselves.
 * Any member can leave the workspace as long as at least 1 admin remains.
 */
export class WorkspaceLeavePolicy extends BasePolicy {
  evaluate(context: WorkspaceLeavePolicyContext, resource: WorkspaceLeavePolicyResource): PolicyResult {
    // Check if user is actually a member of the workspace
    const currentMember = this.getCurrentMember(context, resource)
    if (!currentMember) {
      return this.deny('WORKSPACE_MEMBER_LEAVE::DENIED_USER_NOT_MEMBER')
    }

    // Get current user's role
    const currentUserRole = currentMember.memberType

    // If user is an admin, check if they can leave without breaking admin requirements
    if (currentUserRole === 'Admin') {
      return this.evaluateAdminLeave(context, resource)
    }

    // Regular members can leave freely (as long as there's at least 1 admin remaining)
    // We still need to check admin count even for normal members
    const adminCount = this.getAdminCount(resource.workspaceMembers)
    if (adminCount < 1) {
      return this.deny('WORKSPACE_MEMBER_LEAVE::REQUIRED_AT_LEAST_ONE_ADMIN')
    }

    return this.allow('POLICY::ALLOWED')
  }

  /**
   * Evaluate if an admin can leave the workspace
   */
  private evaluateAdminLeave(
    context: WorkspaceLeavePolicyContext,
    resource: WorkspaceLeavePolicyResource
  ): PolicyResult {
    const adminCount = this.getAdminCount(resource.workspaceMembers)

    // Cannot leave if they are the only admin
    if (adminCount <= 1) {
      return this.deny('WORKSPACE_MEMBER_LEAVE::REQUIRED_AT_LEAST_ONE_ADMIN')
    }

    // Check if there will be at least one other admin
    const otherAdmins = resource.workspaceMembers.filter(
      (member) => member.memberType === 'Admin' && member.id !== context.user.id
    )

    if (otherAdmins.length === 0) {
      return this.deny('WORKSPACE_MEMBER_LEAVE::REQUIRED_AT_LEAST_ONE_ADMIN')
    }

    // Admin can leave if there are other admins
    return this.allow('POLICY::ALLOWED')
  }

  /**
   * Check if the current user is the workspace owner
   */
  private isWorkspaceOwner(context: WorkspaceLeavePolicyContext, resource: WorkspaceLeavePolicyResource): boolean {
    return context.user.id === resource.workspaceOwnerId
  }

  /**
   * Get the current user as a workspace member
   */
  private getCurrentMember(
    context: WorkspaceLeavePolicyContext,
    resource: WorkspaceLeavePolicyResource
  ): workspaceSchemas.Workspace['members'][0] | undefined {
    return resource?.workspaceMembers?.find((member) => member.id === context.user.id)
  }

  /**
   * Count total number of admins in the workspace
   */
  private getAdminCount(workspaceMembers: workspaceSchemas.Workspace['members']): number {
    return workspaceMembers.filter((member) => member.memberType === 'Admin').length
  }

  /**
   * Get all admin members except the current user
   */
  private getOtherAdmins(
    context: WorkspaceLeavePolicyContext,
    workspaceMembers: workspaceSchemas.Workspace['members']
  ): workspaceSchemas.Workspace['members'] {
    return workspaceMembers.filter((member) => member.memberType === 'Admin' && member.id !== context.user.id)
  }

  /**
   * Check if the current user is a workspace admin
   */
  private isCurrentUserAdmin(context: WorkspaceLeavePolicyContext, resource: WorkspaceLeavePolicyResource): boolean {
    const currentMember = this.getCurrentMember(context, resource)
    return currentMember?.memberType === 'Admin'
  }
}
