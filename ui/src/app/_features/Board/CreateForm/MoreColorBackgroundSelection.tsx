import React from 'react'
import {
  BoardLinearPaletteBackgroundSelection,
  BoardSolidPaletteBackgroundSelection
} from './BoardPaletteBackgroundSelection'

function MoreColorBackgroundSelection() {
  return (
    <div className='flex flex-col px-4'>
      <BoardLinearPaletteBackgroundSelection
        colorQuantity='max'
        className='grid grid-cols-3 gap-2'
      />
      <span className='my-6 block h-[1px] w-full bg-stone-300'></span>
      <BoardSolidPaletteBackgroundSelection
        colorQuantity='max'
        className='grid grid-cols-3 gap-2'
      />
    </div>
  )
}

export default MoreColorBackgroundSelection
