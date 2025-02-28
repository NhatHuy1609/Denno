import React from 'react'
import Image from 'next/image'
import KanbanBoardPlaceHolder from 'public/kanban-board-placeholder.png'
import AliBackground from 'public/board/backgrounds/colors/linear/ali.jpg'
import { useBoardCreateForm } from './context'

function BoardBackgroundSelectionDisplay() {
  const { backgroundSource } = useBoardCreateForm()

  return (
    <div className='flex h-[120px] w-full justify-center'>
      <div className='relative w-3/4 overflow-hidden rounded-sm'>
        <Image
          alt='board-background'
          width={300}
          height={200}
          src={backgroundSource || AliBackground}
          className='object-fit size-full'
        />
        <Image
          src={KanbanBoardPlaceHolder}
          alt='kanban-board-placeholder'
          className='absolute left-0 top-0 size-full'
        />
      </div>
    </div>
  )
}

export default BoardBackgroundSelectionDisplay
