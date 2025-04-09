import { Workspace } from '@/entities/workspace/workspace.types'
import { Avatar } from '@/ui'
import React from 'react'
import MemberControls from './MemberControls'

type MemberDisplayItemProps = {
  member: NonNullable<Workspace['members']>[number]
  joinedBoardCount: NonNullable<Workspace['boardCounts']>[number]
}

export default function MemberDisplayItem({ member, joinedBoardCount }: MemberDisplayItemProps) {
  const { fullName, avatar, email } = member
  const { boardCount } = joinedBoardCount

  return (
    <div className='flex w-full flex-1 items-center justify-between gap-6'>
      <MemberInfo name={fullName} avatar={avatar} email={email} />
      <MemberControls member={member} boardCount={boardCount} />
    </div>
  )
}

function MemberInfo({ name, email, avatar }: { name: string; email: string; avatar: string }) {
  return (
    <div className='flex items-center gap-4'>
      <Avatar src={avatar} name="user's avatar" />
      <div className='flex flex-col'>
        <span className='text-base font-semibold text-black'>{name}</span>
        <span className='text-sm text-slate-600'>@{email}</span>
      </div>
    </div>
  )
}
