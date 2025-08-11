import React from 'react'
import BoardNameField from './BoardNameField'
import FavourButton from './FavourButton'
import { useSelectCurrentUserBoardPermissions } from '@/store/features/board'

function BoardPrimaryActions() {
  const { canEditBoard } = useSelectCurrentUserBoardPermissions() || {}

  return (
    <div className='flex items-center gap-1'>
      <BoardNameField enabledEdit={canEditBoard} />
      <FavourButton />
    </div>
  )
}

export default BoardPrimaryActions
