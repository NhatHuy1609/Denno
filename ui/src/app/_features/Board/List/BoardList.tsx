import React from 'react'
import BoardItem from './BoardItem'
import { boardSchemas } from '@/entities/board'
import CreateNewBoardButton from './CreateNewBoardButton'

interface Props {
  boards: boardSchemas.Boards
  selectedWorkspaceId?: string
  onToggleStarBoard?: () => void
}

function BoardList({ boards, selectedWorkspaceId, onToggleStarBoard }: Props) {
  return (
    <ul className='grid grid-cols-4 gap-4'>
      {boards.map((board) => (
        <li key={board.id}>
          <BoardItem item={board} onToggleStarBoard={onToggleStarBoard} />
        </li>
      ))}
      {selectedWorkspaceId && <CreateNewBoardButton selectedWorkspaceId={selectedWorkspaceId} />}
    </ul>
  )
}

export default BoardList
