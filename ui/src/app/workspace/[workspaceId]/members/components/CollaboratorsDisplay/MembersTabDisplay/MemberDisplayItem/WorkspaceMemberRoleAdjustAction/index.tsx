import React from 'react'
import { useMemberDisplayItemContext } from '../context'
import DropdownMenuPrimary, { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { workspaceSchemas } from '@/entities/workspace'

function WorkspaceMemberRoleAdjustAction() {
  const { member } = useMemberDisplayItemContext()
  const { memberType: role } = member

  const items: DropdownMenuPrimaryItemProps<workspaceSchemas.WorkspaceMemberType>[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Normal', label: 'Normal' }
  ]

  return (
    <DropdownMenuPrimary
      items={items}
      contentTitle='Change permissions'
      triggerTitle={role}
      defaultSelectedIndex={items.findIndex((item) => item.value === role)}
      // renderOtherItems={() => <DropdownOtherActions boardId={boardId} memberId={member.id} />}
      // disabled={isRoleDropdownDisabled()}
      // onSelect={handleUpdateBoardMemberRole}
      contentClassName='min-w-[290px]'
    />
  )
}

export default WorkspaceMemberRoleAdjustAction
