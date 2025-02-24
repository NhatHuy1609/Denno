import React from 'react'
import CardListHeader from './CardListHeader'
import { CSS, Transform } from '@dnd-kit/utilities'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'

interface Props {
  id: string
  name?: string
  dragging?: boolean
  transform?: Transform | null
  transition?: string | null
  listeners?: DraggableSyntheticListeners
}

export const CardList = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    ({ id, name, dragging, transform, transition, listeners, ...props }, ref) => {
      const style: React.CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition: transition ?? undefined,
        border: '1px solid #ddd',
        padding: '10px',
        backgroundColor: 'white',
        cursor: 'grab',
        userSelect: 'none',
        height: '80px',
        flexShrink: 0,
        flexBasis: '272px',
        borderRadius: '0.75rem',
        background: 'var(--ds-card-list-background)',
        paddingBlock: '0.5rem',
        opacity: dragging ? '0.8' : undefined
      }

      return (
        <div
          style={style}
          {...listeners}
          ref={ref}
          className='h-[80px] w-[272px] shrink-0 rounded-xl bg-[var(--ds-card-list-background)] p-2'
          {...props}
        >
          <CardListHeader name={name} />
        </div>
      )
    }
  )
)

export default CardList
