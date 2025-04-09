import React, { useRef } from 'react'
import { Workspace } from '@/entities/workspace/workspace.types'
import MembersDisplay from './MembersDisplay'
import NameFilterInput from '../NameFilterInput'

type MembersPanelProps = {
  workspace: Workspace
}

function MembersPanel({ workspace }: MembersPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { members, boardCounts } = workspace

  return (
    <div className='w-full'>
      <NameFilterInput ref={inputRef} />
      <MembersDisplay members={members} boardCounts={boardCounts} />
    </div>
  )
}

export default MembersPanel
