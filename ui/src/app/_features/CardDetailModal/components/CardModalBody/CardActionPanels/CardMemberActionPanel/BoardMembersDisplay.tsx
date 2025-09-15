import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import { useBoardQuery } from '@/app/_hooks/query'
import { Avatar } from '@/ui'
import React from 'react'
import BoardMemberDisplayItem from './BoardMemberDisplayItem'

function BoardMembersDisplay() {
  const { boardId = '' } = useCardDetailModalContext()
  const { data: boardData } = useBoardQuery(
    boardId,
    {
      includeBoardMembers: true
    },
    {
      enabled: !!boardId
    }
  )

  const { members = [] } = boardData || {}

  if (members.length === 0) {
    return null
  }

  return (
    <div className='mt-2 w-full'>
      <h3 className='text-xs font-semibold text-gray-800'>Board members</h3>
      <div className='mt-1 flex flex-col gap-2'>
        {members.map((member) => (
          <BoardMemberDisplayItem key={member.memberId} member={member.member} />
        ))}
      </div>
    </div>
  )
}

export default BoardMembersDisplay
