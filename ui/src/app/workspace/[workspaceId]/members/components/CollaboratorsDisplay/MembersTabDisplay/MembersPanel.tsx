import React from 'react'
import { Workspace } from '@/entities/workspace/workspace.types'
import MembersDisplay from './MembersDisplay'

type MembersPanelProps = {
  workspace: Workspace
}

function MembersPanel({ workspace }: MembersPanelProps) {
  const { members, boardCounts } = workspace

  return (
    <div className='w-full'>
      <MembersDisplay members={members} boardCounts={boardCounts} />
    </div>
  )
}

export default MembersPanel
