import React from 'react'
import UserBoardsHeader from './UserBoardsHeader'
import UserBoardsList from './UserBoardsList'

function PrimarySidebarUserBoardsByWorkspace() {
  return (
    <div className='mt-4 w-auto'>
      <UserBoardsHeader />
      <UserBoardsList />
    </div>
  )
}

export default PrimarySidebarUserBoardsByWorkspace
