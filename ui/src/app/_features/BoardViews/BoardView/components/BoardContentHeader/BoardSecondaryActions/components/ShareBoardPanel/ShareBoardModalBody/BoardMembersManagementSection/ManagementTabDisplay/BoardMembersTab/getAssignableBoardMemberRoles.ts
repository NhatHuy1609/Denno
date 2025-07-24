import type { boardTypes } from "@/entities/board";
import type { PolicyContext } from "@/permissions/core/types";
import type { DropdownMenuPrimaryItemProps } from "@/app/_components/DropdownMenuPrimary";
import { evaluateDynamicDropdownItems } from "@/permissions/utils/evaluate-dynamic-dropdown";

type BaseRoleDefinition = {
  value: boardTypes.BoardMemberRole,
  label: string
}

type DynamicProperties = {
  available: boolean
  description?: string
}

const baseRoleDefinitions: Array<BaseRoleDefinition> = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'Member',
    label: 'Member',
  },
  {
    value: 'Observer',
    label: 'Observer',
  },
]

export function getAssignableBoardMemberRoles(
  context: PolicyContext,
  resource: {
    targetMemberId: string
  }
): DropdownMenuPrimaryItemProps<typeof baseRoleDefinitions[number]['value']>[] {
  return evaluateDynamicDropdownItems<
    typeof baseRoleDefinitions[number],
    DynamicProperties
  >(
    baseRoleDefinitions,
    [
      {
        propertyName: 'available',
        action: 'assign_role',
        resource: 'board_member',
        mapItemToPolicyResource: (roleItem, _, data) => ({
          ...data,
          targetRole: roleItem.value,
          targetMemberId: data.targetMemberId
        }),
        mapPolicyResult: (result) => result.allowed
      },
      {
        propertyName: 'description',
        action: 'assign_role',
        resource: 'board_member',
        mapItemToPolicyResource: (roleItem, _, data) => ({
          ...data,
          targetRole: roleItem.value,
          targetMemberId: data.targetMemberId
        }),
        mapPolicyResult: (result) => {
          const { reason: { code } = {} } = result
          if (code === 'BOARD_MEMBER_ROLE::REQUIRED_ADMIN_LEVEL') {
            return 'Boards must have at least one admin'
          }
          return ''
        }
      }
    ],
    context,
    resource
  )
}