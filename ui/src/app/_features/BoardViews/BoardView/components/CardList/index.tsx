import React from 'react'
import CardListHeader from './CardListHeader'
import { CSS, Transform } from '@dnd-kit/utilities'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import { cardListTypes } from '@/entities/cardList'
import CardListFooter from './CardListFooter'
import { CardListProvider } from './context'

interface Props {
  children: React.ReactNode
  cardListData?: cardListTypes.CardList
  dragging?: boolean
  transform?: Transform | null
  transition?: string | null
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

export const CardList = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        children,
        cardListData,
        dragging,
        transform,
        transition,
        listeners,
        setActivatorNodeRef,
        ...props
      },
      ref
    ) => {
      const style: React.CSSProperties = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        transition: transition ?? undefined,
        border: '1px solid #ddd',
        padding: '10px',
        backgroundColor: 'white',
        userSelect: 'none',
        minHeight: '80px',
        flexShrink: 0,
        flexBasis: '272px',
        borderRadius: '0.75rem',
        background: 'var(--ds-card-list-background)',
        paddingBlock: '0.5rem',
        opacity: dragging ? '0.8' : undefined
      }

      return (
        <CardListProvider value={{ cardListData }}>
          <div className='size-auto'>
            <div ref={ref} style={style} className='flex w-[272px] flex-col gap-2' {...props}>
              <CardListHeader cardListData={cardListData} listeners={listeners} />
              {children}
              <CardListFooter />
            </div>
          </div>
        </CardListProvider>
      )
    }
  )
)

export default CardList
