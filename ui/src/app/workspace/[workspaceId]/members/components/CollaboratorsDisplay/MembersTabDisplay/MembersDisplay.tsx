import React, { useRef, useState } from 'react'
import { cn } from '@/lib/styles/utils'
import { arrayToMap } from '@/utils/arrayToMap'
import { Workspace } from '@/entities/workspace/workspace.types'
import MemberDisplayItem from './MemberDisplayItem'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

type MembersDisplayProps = {
  members: Workspace['members']
  boardCounts: Workspace['boardCounts']
}

function MembersDisplay({ members = [], boardCounts }: MembersDisplayProps) {
  const [searchedName, setSearchedName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter members based on the searched name
  const filteredMembers = members.filter((member) =>
    member.fullName.toLowerCase().includes(searchedName.toLowerCase())
  )

  // Use arrayToMap to create a map of board counts for quick lookup
  const joinedBoardCountsMap = arrayToMap(boardCounts, 'idMember')

  const handleChangeFilterInput = () => {
    const value = inputRef.current?.value ?? ''
    setSearchedName(value)
  }

  return (
    <div className='w-full'>
      {/* Name filter input */}
      <div className='w-full border-y border-gray-300 py-3'>
        <PrimaryInputText
          ref={inputRef}
          onChange={handleChangeFilterInput}
          placeholder='Filter by name'
          className={cn('w-[250px] border border-black p-2')}
        />
      </div>
      <div className='mt-2 flex w-full flex-col divide-y divide-gray-300 py-2'>
        {filteredMembers?.map((member) => (
          <MemberDisplayItem
            key={member.id}
            member={member}
            joinedBoardCount={
              joinedBoardCountsMap.get(member.id) ?? { idMember: '', boardCount: 0 }
            }
          />
        ))}
      </div>
    </div>
  )
}

export default MembersDisplay
