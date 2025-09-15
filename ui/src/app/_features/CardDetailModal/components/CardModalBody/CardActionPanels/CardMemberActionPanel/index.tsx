import React from 'react'
import SelectedCardMembers from './SelectedCardMembers'
import BoardMembersDisplay from './BoardMembersDisplay'

function CardMemberActionPanel() {
  return (
    <div className='w-auto'>
      <h3 className='text-center text-sm font-semibold text-gray-700'>Members</h3>
      <SelectedCardMembers />
      <BoardMembersDisplay />
    </div>
  )
}

export default CardMemberActionPanel
