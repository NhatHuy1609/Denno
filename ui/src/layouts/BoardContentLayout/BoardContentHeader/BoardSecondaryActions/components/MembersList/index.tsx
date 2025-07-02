import React from 'react'
import MemberItem from './MemberItem'
import { useBoardQuery } from '@/app/_hooks/query'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

type Props = {}

function MembersList({}: Props) {
  const boardId = getLocalStorageItem(PersistedStateKey.RecentAccessBoard)
  const { data: board } = useBoardQuery(boardId, {
    includeBoardMembers: true
  })

  // Take board members from the board data
  const { members = [] } = board || {}

  return (
    <ul className='style-none flex items-center'>
      {members.map((member, index) => (
        <li
          style={{
            position: 'relative',
            zIndex: members.length - index,
            marginLeft: index === 0 ? 0 : '-6px'
          }}
          key={index}
        >
          <MemberItem src={member.member?.avatar || ''} />
        </li>
      ))}
    </ul>
  )
}

export default MembersList
