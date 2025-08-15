import React from 'react'
import ShareBoardForm from './ShareBoardForm'
import ShareBoardWithLink from './ShareBoardWithLink'
import BoardMembersManagementSection from './BoardMembersManagementSection'

function ShareBoardModalBody() {
  return (
    <div className='relative flex w-full flex-col gap-2'>
      <ShareBoardForm />
      <ShareBoardWithLink />
      <BoardMembersManagementSection />
    </div>
  )
}

export default ShareBoardModalBody
