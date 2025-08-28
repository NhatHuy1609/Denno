import React from 'react'
import { PHOTOS_BACKGROUND } from '@/data/board-photo-backgrounds'
import BoardPhotoBackgroundSelection from './BoardPhotoBackgroundSelection'
import { ScrollArea } from '@/ui'

function MorePhotosBackgroundSelection() {
  return (
    <div className='max-h-[256px] w-full pl-4'>
      <ScrollArea className='h-[256px] pr-6' type='always'>
        <BoardPhotoBackgroundSelection
          showOwner={true}
          photoQuantity={PHOTOS_BACKGROUND.length}
          className='grid grid-cols-2 gap-2'
        />
      </ScrollArea>
    </div>
  )
}

export default MorePhotosBackgroundSelection
