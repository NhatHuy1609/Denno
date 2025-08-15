import React from 'react'
import Avatar from '@/ui/components/Avatar'

type Props = {
  src: string
}

function MemberItem({ src }: Props) {
  return (
    <div className='cursor-pointer transition-all hover:brightness-[1.2]'>
      <Avatar src={src} size='sm' name="member's avatar" />
    </div>
  )
}

export default MemberItem
