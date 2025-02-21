import React from 'react'
import CardListHeader from './CardListHeader'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ICardList {
  id: string
  name: string
  boardId: string
}

function CardList({ id, boardId, name }: ICardList) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id
  })

  // console.log(transform)

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ddd',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: 'white',
    cursor: 'grab',
    userSelect: 'none',
    height: '80px',
    flexShrink: 0,
    flexBasis: '272px',
    borderRadius: '0.75rem',
    background: 'var(--ds-card-list-background)',
    paddingBlock: '0.5rem'
  }

  return (
    <div
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      className='h-[80px] w-[272px] shrink-0 rounded-xl bg-[var(--ds-card-list-background)] p-2'
    >
      <CardListHeader name={name} />
    </div>
  )
}

export default CardList
