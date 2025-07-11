import React from 'react'
import MembersList from './components/MembersList'
import ShareBoardPanel from './components/ShareBoardPanel'
import BoardOptionMenu from './components/BoardOptionMenu'

function BoardSecondaryActions() {
  return (
    <div className='flex items-center gap-4'>
      <MembersList />
      <ShareBoardPanel />
      <BoardOptionMenu />
    </div>
  )
}

export default BoardSecondaryActions
