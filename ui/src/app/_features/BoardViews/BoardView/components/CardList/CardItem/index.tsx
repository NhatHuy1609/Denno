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
      padding: '4px',
      border: '1px solid blue'
    }

    return (
      <div
        ref={ref}
        style={style}
        className='h-[60px] w-full border border-blue-500'
        {...props}
        {...listeners}
      >
        {name}
      </div>
    )
  }
)

export default CardItem
