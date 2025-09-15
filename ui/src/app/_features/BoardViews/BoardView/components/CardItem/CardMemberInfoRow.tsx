import React from 'react'
import { useCardMembersQuery } from '@/app/_hooks/query/card/useCardMembersQuery'
import { Avatar } from '@/ui'

type Props = {
  cardId: string
}

function CardMemberInfoRow({ cardId }: Props) {
  const { data: cardMembers } = useCardMembersQuery(cardId)

  return (
    <div className='flex w-full justify-end'>
      <div className='flex gap-1'>
        {cardMembers?.members.map((member) => <Avatar size='sm' src={member.avatar} name={member.fullName} />)}
      </div>
    </div>
  )
}

export default CardMemberInfoRow
