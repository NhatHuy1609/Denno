import React from 'react'
import Avatar from '@/ui/components/Avatar'
import DropdownMenuPrimary, {
  DropdownMenuPrimaryItemProps
} from '@/app/_components/DropdownMenuPrimary'
import { enumTypes } from '@/service/api/_enums'
import { formatDateTime } from '@/utils/formatDateTime'
import { boardTypes } from '@/entities/board'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { HiOutlineXMark } from 'react-icons/hi2'

interface BoardJoinRequestItemProps {
  request: boardTypes.BoardJoinRequest
}

function BoardJoinRequestItem({ request }: BoardJoinRequestItemProps) {
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
      description: 'Board members can view and edit cards, lists, and some board settings.',
      available: true
    },
    {
      value: 'Observer',
      label: 'Observer',
      description: 'Board observers can view and comment',
      available: true
    }
  ]

  const { name = '', avatar = '' } = request?.requester || {}

  return (
    <div className='flex w-full items-center justify-between gap-3'>
      <div className='flex flex-1 items-center gap-2'>
        <Avatar src={avatar} size='base' name={name} />
        <div className='flex flex-col justify-between gap-2 text-xs text-gray-500'>
          <span className='text-sm text-black'>{name}</span>
          <span>Request sent {formatDateTime(request?.requestedAt)}</span>
        </div>
      </div>
      <div className='flex items-center justify-between gap-2'>
        <DropdownMenuPrimary
          items={boardMemberRoles}
          triggerTitle='Add to board'
          defaultSelectedIndex={0}
        />
        <CustomizableButton
          size='icon'
          intent='icon'
          className='h-9 bg-gray-300'
          startIcon={<HiOutlineXMark className='text-black' />}
        />
      </div>
    </div>
  )
}

export default BoardJoinRequestItem
