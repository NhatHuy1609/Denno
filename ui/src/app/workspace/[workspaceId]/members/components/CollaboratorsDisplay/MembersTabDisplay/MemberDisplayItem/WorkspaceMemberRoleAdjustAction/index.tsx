import React from 'react'
import { useMemberDisplayItemContext } from '../context'
import { useGetAssignableMemberPermissions } from './useGetAssignableMemberPermissions'
import useUpdateWorkspaceMemberRoleMutation from '@/app/_hooks/mutation/workspace/useUpdateWorkspaceMemberRoleMutation'
import { workspaceSchemas } from '@/entities/workspace'
import DropdownMenuPrimary, { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'

function WorkspaceMemberRoleAdjustAction() {
  const { member } = useMemberDisplayItemContext()
  const { assignablePermissions, alertMessage, workspaceId } = useGetAssignableMemberPermissions(member.id)

  const { mutateAsync: updateWorkspaceMemberRoleAsync } = useUpdateWorkspaceMemberRoleMutation({
    onError: (error) => {
      console.error(error)
    }
  })

  const { memberType: memberRole } = member

  const isRoleDropdownDisabled = () => {
    return assignablePermissions.every((p) => !p.available)
  }

  const handleSelectWorkspaceMemberRole = async (
    item: DropdownMenuPrimaryItemProps<workspaceSchemas.WorkspaceMemberType>
  ) => {
    if (item.value === memberRole) {
      return
    }

    await updateWorkspaceMemberRoleAsync({
      workspaceId,
      memberId: member.id,
      updateWorkspaceMemberRoleDto: {
        newMemberRole: item.value
      }
    })
  }

  return (
    <DropdownMenuPrimary
      items={assignablePermissions}
      contentTitle='Change permissions'
      triggerTitle={memberRole}
      defaultSelectedIndex={assignablePermissions.findIndex((item) => item.value === memberRole)}
      renderOtherItems={() => {
        if (!alertMessage) {
          return null
        }

        return (
          <div className='w-full px-4'>
            <div className='my-2 h-[1px] w-full bg-gray-200' />
            <span className='block w-full text-[13px] font-medium text-slate-700'>{alertMessage}</span>
          </div>
        )
      }}
      disabled={isRoleDropdownDisabled()}
      onSelect={handleSelectWorkspaceMemberRole}
      contentClassName='min-w-[290px]'
      triggerClassName='max-w-24'
    />
  )
}

export default WorkspaceMemberRoleAdjustAction
