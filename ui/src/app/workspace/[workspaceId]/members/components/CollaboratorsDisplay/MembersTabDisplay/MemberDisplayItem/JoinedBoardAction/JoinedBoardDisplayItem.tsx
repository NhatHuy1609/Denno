import React from 'react'
import Image from 'next/image'
import type { boardSchemas } from '@/entities/board'
import BoardLinkNavigation from '@/app/_components/BoardLinkNavigation'

type Props = {
  board: boardSchemas.Board
}

function JoinedBoardDisplayItem({ board }: Props) {
  return (
    <BoardLinkNavigation boardId={board.id}>
      <div className='flex w-full items-center justify-between gap-2 rounded-sm p-2 hover:bg-gray-200'>
        <div className='flex items-center gap-2'>
          <Image
            src={board.background}
            alt={board.name}
            width={80}
            height={40}
            loading='lazy'
            className='aspect-[4/3] w-[32px] rounded-sm'
          />
          <span className='text-sm text-black'>{board.name}</span>
        </div>
      </div>
    </BoardLinkNavigation>
  )
}

export default JoinedBoardDisplayItem
