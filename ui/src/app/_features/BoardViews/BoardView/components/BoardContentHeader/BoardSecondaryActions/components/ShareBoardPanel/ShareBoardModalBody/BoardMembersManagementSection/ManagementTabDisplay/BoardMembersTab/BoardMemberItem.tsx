import React from 'react'
import { userTypes } from '@/entities/user'
import Avatar from '@/ui/components/Avatar'
import DropdownMenuPrimary, {
  DropdownMenuPrimaryItemProps
} from '@/app/_components/DropdownMenuPrimary'
import { enumTypes } from '@/service/api/_enums'

interface BoardMemberItemProps {
  member: userTypes.User
  memberRole: string
}

function BoardMemberItem({ member, memberRole }: BoardMemberItemProps) {
  const boardMemberRoles: Array<DropdownMenuPrimaryItemProps<enumTypes.BoardMemberRoleEnum>> = [
    {
      value: 'Admin',
      label: 'Admin',
      description: '',
      available: true
    },
    {
      value: 'Member',
      label: 'Member',
      description: 'Boards must have at least one admin.',
      available: true
    },
    {
      value: 'Observer',
      label: 'Observer',
      description: 'Add people with limited permissions to this board.',
      available: true
    }
  ]

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
        items={boardMemberRoles}
        triggerTitle={boardMemberRoles.find((role) => role.value === memberRole)?.label}
        defaultSelectedIndex={boardMemberRoles.findIndex((role) => role.value === memberRole)}
        renderOtherItems={() => (
          <div className='flex flex-col px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
            <span className='font-semibold'>Leave board</span>
            <span className='text-gray-500'>Boards must have at least one admin.</span>
          </div>
        )}
      />
    </div>
  )
}

export default BoardMemberItem
