import React from 'react'
import BoardAdjustButton from './BoardAdjustButton'
import { Workspace } from '@/entities/workspace/workspace.types'
import RoleAdjustButton from './RoleAdjustButton'
import UserRemoveButton from './UserRemoveButton'

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
      <BoardAdjustButton userId={id} userName={fullName} boardCount={boardCount} />
      <RoleAdjustButton />
      <UserRemoveButton />
    </div>
  )
}
