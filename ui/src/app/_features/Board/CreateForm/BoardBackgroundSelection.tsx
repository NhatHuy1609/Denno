import React from 'react'
import MoreBackgroundButton from './MoreBackgroundButton'
import BoardPhotoBackgroundSelection from './BoardPhotoBackgroundSelection'
import { BoardLinearPaletteBackgroundSelection } from './BoardPaletteBackgroundSelection'

function BoardBackgroundSelection() {
  return (
    <div className='w-full'>
      <h4 className='mb-1 text-xs font-bold text-gray-700'>Background</h4>
      <div className='mb-2'>
        <BoardPhotoBackgroundSelection photoQuantity={4} />
      </div>
      <div className='flex gap-1'>
        <BoardLinearPaletteBackgroundSelection colorQuantity={5} className='w-[80%]' />
        <MoreBackgroundButton />
      </div>
    </div>
  )
}

export default BoardBackgroundSelection
