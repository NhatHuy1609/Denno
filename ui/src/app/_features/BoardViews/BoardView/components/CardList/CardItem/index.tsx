import React from 'react'
import { cardTypes } from '@/entities/card'
import { Transform, CSS } from '@dnd-kit/utilities'
import { DraggableSyntheticListeners } from '@dnd-kit/core'

interface Props {
  cardData?: cardTypes.Card
  dragging?: boolean
  transform?: Transform | null
  transition?: string | null
  listeners?: DraggableSyntheticListeners
}

const CardItem = React.forwardRef<HTMLDivElement, Props>(
  ({ cardData, dragging, transform, transition, listeners, ...props }, ref) => {
    const { name } = cardData || {}

    const style: React.CSSProperties = {
      transform: transform ? CSS.Translate.toString(transform) : undefined,
      transition: transition ?? undefined,
      opacity: dragging ? '0.5' : '1'
    }

    return (
      <div
        ref={ref}
        style={style}
        className='w-full rounded-lg border-2 border-transparent bg-white px-3 py-[6px] shadow-[0_1px_1px_rgba(0,0,0,0.15)] hover:border-2 hover:border-blue-500'
        {...props}
        {...listeners}
      >
        <span className='text-sm'>{name}</span>
      </div>
    )
  }
)

export default CardItem
