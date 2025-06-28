import React from 'react'
import Avatar from '@/ui/components/Avatar'

type Props = {
  src: string
}

function MemberItem({ src }: Props) {
  return <Avatar src={src} size='sm' name="member's avatar" />
}

export default MemberItem
