import React from 'react'
import { Workspace } from '@/entities/workspace/workspace.schemas'
import JoinedBoardAction from './JoinedBoardAction'
import WorkspaceMemberRoleAdjustAction from './WorkspaceMemberRoleAdjustAction'
import MemberOtherActions from './MemberOtherActions'

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
      <MemberOtherActions memberId={id} />
    </div>
  )
}
