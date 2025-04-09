import { Workspace } from '@/entities/workspace/workspace.types'
import React from 'react'
import MemberDisplayItem from './MemberDisplayItem'
import { arrayToMap } from '@/utils/arrayToMap'

type MembersDisplayProps = {
  members: Workspace['members']
  boardCounts: Workspace['boardCounts']
}

function MembersDisplay({ members, boardCounts }: MembersDisplayProps) {
  // Use arrayToMap to create a map of board counts for quick lookup
  const joinedBoardCountsMap = arrayToMap(boardCounts, 'idMember')

  return (
    <div className='mt-4 flex w-full flex-col border-y border-gray-300 py-2'>
      {members?.map((member) => (
        <MemberDisplayItem
          key={member.id}
          member={member}
          joinedBoardCount={joinedBoardCountsMap.get(member.id) ?? { idMember: '', boardCount: 0 }}
        />
      ))}
    </div>
  )
}

export default MembersDisplay
