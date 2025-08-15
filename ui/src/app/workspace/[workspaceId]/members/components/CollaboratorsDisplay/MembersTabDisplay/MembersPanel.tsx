import React from 'react'
import MembersDisplay from './MembersDisplay'
import { Workspace } from '@/entities/workspace/workspace.schemas'

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
