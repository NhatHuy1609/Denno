import React from 'react'
import { useBoardMemberOtherActions } from '../hooks/useBoardMemberOtherActions'
import { useQuery } from '@tanstack/react-query'

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

  console.log('Other Actions:', otherActions)

  return (
    <>
      {otherActions?.map((action) => (
        <div className='flex flex-col px-4 py-2 text-sm text-red-600 hover:bg-gray-100' key={action.action}>
          <span className='font-semibold'>{action.label}</span>
          <span className='text-xs'>{action.reason}</span>
        </div>
      ))}
    </>
  )
}

export default DropdownOtherActions
