import React from 'react'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/useCardListsByBoard'
import CardListAddButton from './components/CardListAddButton'
import SortableCardLists from './components/SortableCardLists'

function BoardView() {
  const { boardId } = useParams()
  const { data: cardLists = [] } = useCardListsByBoards(boardId as string)

  return (
    <div className='flex size-full max-w-full gap-3 overflow-x-scroll p-2'>
      <SortableCardLists cardLists={cardLists} />
      <CardListAddButton />
    </div>
  )
}

export default BoardView
