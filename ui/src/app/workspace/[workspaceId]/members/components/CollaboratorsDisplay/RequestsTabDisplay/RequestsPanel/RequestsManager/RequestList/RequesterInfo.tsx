import React from 'react'
import { Avatar } from '@/ui'
import { WorkspaceJoinRequest } from '@/entities/workspace/workspace.schemas'

type Props = {
  requester: WorkspaceJoinRequest['requester']
}

function RequesterInfo({ requester }: Props) {
  const { name, avatar, email, id } = requester

  return (
    <div className='flex items-center gap-2'>
      <Avatar src={avatar} name={name} size='base' />
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-medium'>{name}</p>
        <span className='text-[12px]'>@{email.slice(0, email.indexOf('@'))}</span>
      </div>
    </div>
  )
}

export default RequesterInfo
