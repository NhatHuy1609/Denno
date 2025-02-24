import React from 'react'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/useCardListsByBoard'
import SortableCardLists from './components/SortableCardLists'

function BoardView() {
  const { boardId } = useParams()
  const { data: cardLists = [] } = useCardListsByBoards(boardId as string)

  return (
    <div className='relative w-full grow p-2'>
      <SortableCardLists cardLists={cardLists} />
    </div>
  )
}

export default BoardView
