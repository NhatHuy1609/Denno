import React from 'react'
import { useParams } from 'next/navigation'
import SortableCardLists from './components/SortableCardLists'
import BoardViewHeader from './components/BoardContentHeader'
import { useCardListsOfBoardQuery } from '@/app/_hooks/query/cardList/useCardListsByBoard'

function BoardView() {
  const { boardId } = useParams<{ boardId: string }>()
  const { data: cardLists } = useCardListsOfBoardQuery(boardId as string)

  return (
    <div className='relative flex h-full flex-1 flex-col overflow-x-auto'>
      <BoardViewHeader />
      {cardLists && <SortableCardLists cardLists={cardLists} />}
    </div>
  )
}

export default BoardView
