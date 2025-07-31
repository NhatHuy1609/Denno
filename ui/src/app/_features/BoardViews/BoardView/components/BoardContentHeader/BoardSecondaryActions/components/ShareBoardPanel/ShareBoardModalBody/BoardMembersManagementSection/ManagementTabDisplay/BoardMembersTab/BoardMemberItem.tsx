import React from 'react'
import type { userTypes } from '@/entities/user'
import Avatar from '@/ui/components/Avatar'
import DropdownMenuPrimary from '@/app/_components/DropdownMenuPrimary'
import { useAssignableBoardRoles } from './useAssignableBoardRoles'
import { useBoardAssignMemberRole } from '@/app/_features/BoardViews/BoardView/components/BoardContentHeader/BoardSecondaryActions/components/ShareBoardPanel/ShareBoardModalBody/BoardMembersManagementSection/ManagementTabDisplay/BoardMembersTab/useBoardAssignMemberRole'
import { boardTypes } from '@/entities/board'

interface BoardMemberItemProps {
  member: userTypes.User
  memberRole: string
}

function BoardMemberItem({ member, memberRole }: BoardMemberItemProps) {
  const { roles: assignableRoles } = useAssignableBoardRoles({
    targetMemberId: member.id
  })

  // Decide if the user can assign a role to the member
  // const { canAssign: canAssignMemberRole } = useBoardAssignMemberRole({
  //   targetMemberId: member.id,
  //   targetMemberRole: memberRole as boardTypes.BoardMemberRole
  // })

  return (
    <div className='flex w-full items-center justify-between gap-3'>
      <Avatar src={member.avatar} size='base' name={member.fullName} />
      <div className='flex flex-1 flex-col justify-between'>
        <span className='text-base text-gray-600'>{member.fullName}</span>
        <div className='flex gap-2 text-xs text-gray-500'>
          <span>{member.email}</span>
          <span>{memberRole}</span>
        </div>
      </div>
      <DropdownMenuPrimary
        // disabled={!canAssignMemberRole}
        items={assignableRoles}
        triggerTitle={assignableRoles.find((role) => role.value === memberRole)?.label}
        defaultSelectedIndex={assignableRoles.findIndex((role) => role.value === memberRole)}
        renderOtherItems={() => (
          <div className='flex flex-col px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
            <span className='font-semibold'>Leave board</span>
          </div>
        )}
        contentClassName='min-w-[290px]'
      />
    </div>
  )
}

export default BoardMemberItem
