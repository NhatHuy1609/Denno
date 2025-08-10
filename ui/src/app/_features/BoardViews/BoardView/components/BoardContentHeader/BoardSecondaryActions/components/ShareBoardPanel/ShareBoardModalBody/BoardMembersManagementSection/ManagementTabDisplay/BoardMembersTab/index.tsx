import React from 'react'
import { useBoardQuery } from '@/app/_hooks/query'
import { PersistedStateKey } from '@/data/persisted-keys'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import BoardMemberItem from './BoardMemberItem'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

export default function BoardMembersTab() {
  const [boardId] = useSyncedLocalStorage<string>(PersistedStateKey.RecentAccessBoard, '')
  const { data: boardData, isPending } = useBoardQuery(boardId, {
    includeBoardMembers: true,
    includeJoinRequests: true
  })

  const { members } = boardData || {}

  if (isPending) {
    return (
      <div className='flex w-full items-center justify-center p-4'>
        <WaterFallLoading />
      </div>
    )
  }

  if (!members?.length) {
    return <div className='flex w-full items-center justify-center p-4 text-lg text-gray-500'>No members found</div>
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {members.map((member) => (
        <BoardMemberItem key={member.memberId} member={member.member} memberRole={member.boardMemberRole} />
      ))}
    </div>
  )
}
