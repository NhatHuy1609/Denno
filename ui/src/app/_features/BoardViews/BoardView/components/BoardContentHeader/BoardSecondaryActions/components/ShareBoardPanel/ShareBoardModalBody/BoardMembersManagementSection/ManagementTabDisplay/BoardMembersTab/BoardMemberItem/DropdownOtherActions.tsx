import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useBoardMemberOtherActions } from '../hooks/useBoardMemberOtherActions'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/styles/utils'

type Props = {
  boardId: string
  memberId: string
}

function DropdownOtherActions({ boardId, memberId }: Props) {
  const { getAvailableOtherMemberActions } = useBoardMemberOtherActions(boardId, memberId)

  const { data: otherActions, isLoading } = useQuery({
    queryKey: ['board-member-other-actions', boardId, memberId],
    queryFn: getAvailableOtherMemberActions,
    staleTime: 5000 // Cache 5 seconds
  })

  return (
    <>
      {otherActions?.map((action) => (
        <DropdownMenuItem key={action.action} className='hover:outline-none'>
          <div
            className={cn('flex cursor-pointer flex-col px-4 py-2 hover:bg-gray-100 hover:outline-none', {
              'cursor-not-allowed opacity-50': !action.available
            })}
          >
            <span className='text-sm font-semibold text-gray-600'>{action.label}</span>
            <span className='text-xs text-gray-500'>{action.description}</span>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  )
}

export default DropdownOtherActions
