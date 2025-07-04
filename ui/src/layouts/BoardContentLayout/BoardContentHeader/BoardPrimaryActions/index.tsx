import React from 'react'
import BoardNameField from './BoardNameField'
import FavourButton from './FavourButton'

function BoardPrimaryActions() {
  return (
    <div className='flex items-center gap-1'>
      <BoardNameField />
      <FavourButton />
    </div>
  )
}

export default BoardPrimaryActions
