import type { workspaceSchemas } from '@/entities/workspace'
import { Workspace } from '@/entities/workspace/workspace.schemas'
import {
  WorkspaceAssignMemberPermissionPolicyContext,
  WorkspaceAssignMemberPermissionPolicyResource
} from '@/permissions/policies/workspace/workspace-assign-member-permission.policy'
import { PolicyAction } from '@/permissions/types/policy-actions'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResource } from '@/permissions/types/policy-resources'
import { evaluateDynamicDropdownItems } from '@/permissions/utils/evaluate-dynamic-dropdown'

type BaseRoleDefinition = {
  label: string
  description: string
  value: workspaceSchemas.WorkspaceMemberType
}

type DynamicProperties = {
  alert?: string
  available: boolean
}

const baseRoleDefinitions: Array<BaseRoleDefinition> = [
  {
    value: 'Admin',
    label: 'Admin',
    description:
      'Can view, create and edit Workspace boards, and change settings for the Workspace. Will have admin rights on all boards in this Workspace.'
  },
  {
    value: 'Normal',
    label: 'Normal',
    description: 'Can view, create, and edit Workspace boards, but not change settings.'
  }
]

export function getAssignableWorkspacePermissions(
  baseContextData: Pick<WorkspaceAssignMemberPermissionPolicyContext, 'targetMemberId' | 'user'>,
  resourceData: WorkspaceAssignMemberPermissionPolicyResource
) {
  const policy = {
    action: 'workspace_assign_member_permission' as PolicyAction,
    resource: 'workspace' as PolicyResource,
    mapItemToPolicyContext: (item: BaseRoleDefinition, context: PolicyContext) => {
      return {
        ...context,
        targetRole: item.value
      }
    }
  }

  return evaluateDynamicDropdownItems<BaseRoleDefinition, DynamicProperties>(
    baseRoleDefinitions,
    [
      {
        ...policy,
        propertyName: 'available',
        mapPolicyResult: (result) => result.allowed
      },
      {
        ...policy,
        propertyName: 'alert',
        mapPolicyResult: (result) => {
          const reasonCode = result.reason?.code
          if (!reasonCode?.includes('ALLOWED')) {
            return result.reason?.message
          }
        }
      }
    ],
    baseContextData,
    resourceData
  )
}
