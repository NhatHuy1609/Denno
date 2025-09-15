import React from 'react'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import SelectedCardMemberItem from './SelectedCardMemberItem'

function SelectedCardMembers() {
  const { cardMembers = [] } = useCardDetailModalContext()

  if (cardMembers.length === 0) return null

  return (
    <div className='mt-2 w-full'>
      <h3 className='mb-2 text-xs font-semibold text-gray-800'>Selected members</h3>
      {cardMembers?.map((member) => <SelectedCardMemberItem key={member.id} member={member} />)}
    </div>
  )
}

export default SelectedCardMembers
