import { Avatar } from '@/ui'
import React from 'react'
import MemberControls from './MemberControls'
import { MemberDisplayItemProvider } from './context'
import { Workspace } from '@/entities/workspace/workspace.schemas'

type MemberDisplayItemProps = {
  member: NonNullable<Workspace['members']>[number]
  joinedBoardCount: NonNullable<Workspace['boardCounts']>[number]
}

export default function MemberDisplayItem({ member, joinedBoardCount }: MemberDisplayItemProps) {
  const { fullName, avatar, email } = member
  const { boardCount } = joinedBoardCount

  return (
    <MemberDisplayItemProvider value={{ member }}>
      <div className='flex w-full flex-1 items-center justify-between gap-6 py-2'>
        <MemberInfo name={fullName} avatar={avatar} email={email} />
        <MemberControls member={member} boardCount={boardCount} />
      </div>
    </MemberDisplayItemProvider>
  )
}

function MemberInfo({ name, email, avatar }: { name: string; email: string; avatar: string }) {
  return (
    <div className='flex basis-[264px] items-center gap-4'>
      <Avatar src={avatar} name="user's avatar" />
      <div className='flex flex-col'>
        <span className='text-base font-semibold text-black'>{name}</span>
        <span className='text-[13px] text-slate-600'>@{email.slice(0, email.indexOf('@'))}</span>
      </div>
    </div>
  )
}
