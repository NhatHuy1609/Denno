import { userTypes } from '@/entities/user'
import React from 'react'
import MemberItem from './MemberItem'

type Props = {
  members: userTypes.User[]
}

function MembersList({ members }: Props) {
  return (
    <div className='flex items-center'>
      {members.map((member) => (
        <MemberItem key={member.id} src={member.avatar || ''} />
      ))}
    </div>
  )
}

export default MembersList
