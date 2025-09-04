import React from 'react'
import BoardList from '@/app/_features/Board/List/BoardList'
import { boardSchemas } from '@/entities/board'
import { FaRegStar } from 'react-icons/fa'

type Props = {
  boards: boardSchemas.Board[]
}

function StarredBoards({ boards }: Props) {
  return (
    <div className='my-8 w-full'>
      <div className='mb-2 flex items-center gap-2'>
        <FaRegStar className='text-2xl text-black' />
        <h2 className='text-lg font-bold'>Starred Boards</h2>
      </div>
      <BoardList boards={boards} />
    </div>
  )
}

export default StarredBoards
