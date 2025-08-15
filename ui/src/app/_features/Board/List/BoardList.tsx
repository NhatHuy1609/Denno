import React from 'react'
import BoardItem from './BoardItem'
import { boardSchemas } from '@/entities/board'

interface Props {
  boards: boardSchemas.Boards
}

function BoardList({ boards }: Props) {
  return (
    <ul className='grid grid-cols-4 gap-4'>
      {boards.map((board) => (
        <li key={board.id}>
          <BoardItem item={board} />
        </li>
      ))}
    </ul>
  )
}

export default BoardList
