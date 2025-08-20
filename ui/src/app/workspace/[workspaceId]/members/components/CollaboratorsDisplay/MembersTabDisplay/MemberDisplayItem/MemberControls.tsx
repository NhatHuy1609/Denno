import React from 'react'
import UserRemoveButton from './UserRemoveButton'
import { Workspace } from '@/entities/workspace/workspace.schemas'
import JoinedBoardAction from './JoinedBoardAction'
import WorkspaceMemberRoleAdjustAction from './WorkspaceMemberRoleAdjustAction'

export default function MemberControls({
  member,
  boardCount = 0
}: {
  member: NonNullable<Workspace['members']>[number]
  boardCount: number
}) {
  const { id, fullName } = member

  return (
    <div className='flex h-8 flex-1 justify-end gap-3'>
      <JoinedBoardAction userId={id} userName={fullName} boardCount={boardCount} />
      <WorkspaceMemberRoleAdjustAction />
      <UserRemoveButton />
    </div>
  )
}
