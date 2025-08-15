import type { boardSchemas } from '@/entities/board'
import type { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { evaluateDynamicDropdownItems } from '@/permissions/utils/evaluate-dynamic-dropdown'
import { PolicyContext } from '@/permissions/types/policy-context'
import {
  BoardAssignMemberRolePolicyContext,
  BoardAssignMemberRolePolicyResource
} from '@/permissions/policies/board/board-assign-member-role.policy'

type BaseRoleDefinition = {
  value: boardSchemas.BoardMemberRole
  label: string
}

type DynamicProperties = {
  available: boolean
  description?: string
}

const baseRoleDefinitions: Array<BaseRoleDefinition> = [
  {
    value: 'Admin',
    label: 'Admin'
  },
  {
    value: 'Member',
    label: 'Member'
  },
  {
    value: 'Observer',
    label: 'Observer'
  }
]

export function getAssignableBoardMemberRoles(
  context: Omit<BoardAssignMemberRolePolicyContext, 'targetRole'> & PolicyContext,
  resourceData: BoardAssignMemberRolePolicyResource
): DropdownMenuPrimaryItemProps<(typeof baseRoleDefinitions)[number]['value']>[] {
  return evaluateDynamicDropdownItems<(typeof baseRoleDefinitions)[number], DynamicProperties>(
    baseRoleDefinitions,
    [
      {
        propertyName: 'available',
        action: 'board_assign_member_role',
        resource: 'board',
        mapItemToPolicyContext: (roleItem, context, data) => ({
          ...context,
          targetRole: roleItem.value,
          targetMemberId: context.targetMemberId
        }),
        mapPolicyResult: (result) => result.allowed
      },
      {
        propertyName: 'description',
        action: 'board_assign_member_role',
        resource: 'board',
        mapItemToPolicyContext: (roleItem, context, data) => ({
          ...context,
          targetRole: roleItem.value,
          targetMemberId: context.targetMemberId
        }),
        mapPolicyResult: (result) => {
          const { reason: { code } = {} } = result
          switch (code) {
            case 'BOARD_MEMBER_ROLE::REQUIRED_AT_LEAST_ONE_OTHER_ADMIN':
              return 'Boards must have at least one admin'
            default:
              return ''
          }
        }
      }
    ],
    context,
    resourceData
  )
}
