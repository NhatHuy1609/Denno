import React from 'react'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/cardList/useCardListsByBoard'
import SortableCardLists from './components/SortableCardLists'
import BoardViewHeader from './components/BoardContentHeader'

function BoardView() {
  const { boardId } = useParams()
  const { data: cardLists } = useCardListsByBoards(boardId as string)

  return (
    <div className='relative flex h-full flex-col'>
      <BoardViewHeader />
      {cardLists && <SortableCardLists cardLists={cardLists} />}
    </div>
  )
}

export default BoardView
