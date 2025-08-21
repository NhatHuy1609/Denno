import React from 'react'
import { useMemberDisplayItemContext } from '../context'
import DropdownMenuPrimary, { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { useGetAssignableMemberPermissions } from './useGetAssignableMemberPermissions'

function WorkspaceMemberRoleAdjustAction() {
  const { member } = useMemberDisplayItemContext()
  const { assignablePermissions, alertMessage } = useGetAssignableMemberPermissions(member.id)

  const { memberType: memberRole } = member

  const isRoleDropdownDisabled = () => {
    return assignablePermissions.every((p) => !p.available)
  }

  return (
    <DropdownMenuPrimary
      items={assignablePermissions}
      contentTitle='Change permissions'
      triggerTitle={memberRole}
      defaultSelectedIndex={assignablePermissions.findIndex((item) => item.value === memberRole)}
      renderOtherItems={() => {
        if (!alertMessage) {
          return
        }

        return (
          <div className='w-full px-4'>
            <div className='my-2 h-[1px] w-full bg-gray-200' />
            <span className='block w-full text-[13px] font-medium text-slate-700'>{alertMessage}</span>
          </div>
        )
      }}
      disabled={isRoleDropdownDisabled()}
      // onSelect={handleUpdateBoardMemberRole}
      contentClassName='min-w-[290px]'
      triggerClassName='max-w-24'
    />
  )
}

export default WorkspaceMemberRoleAdjustAction
