import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCardQuery } from '@/app/_hooks/query/card/useCardQuery'
import { useOnClickOutside } from '@/app/_hooks/useOnClickOutSide'
import { CardDetailModalProvider } from './context'
import CardModalHeader from './components/CardModalHeader'
import CardModalBody from './components/CardModalBody'
import { useCardMembersQuery } from '@/app/_hooks/query/card/useCardMembersQuery'

type Props = {
  cardId: string
  boardId: string
}

function CardDetailModal({ boardId, cardId }: Props) {
  const { data: { card } = {}, refetch: refetchCardQuery } = useCardQuery(cardId, undefined, {
    staleTime: 0,
    refetchOnMount: true
  })
  const { data: { members: cardMembers } = {}, refetch: refetchMembersQuery } = useCardMembersQuery(cardId)

  const { cardListId = '' } = card || {}

  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const [actionPopoverRefs, setActionPopoverRefs] = useState<React.RefObject<HTMLDivElement>[]>([])

  useOnClickOutside([modalRef, ...actionPopoverRefs], () => {
    router.back()
  })

  const registerActionPopoverRef = (ref: React.RefObject<HTMLDivElement>) => {
    setActionPopoverRefs((prev) => {
      if (prev.includes(ref)) return prev
      return [...prev, ref]
    })
  }

  const refetchCard = () => {
    refetchCardQuery()
    refetchMembersQuery()
  }

  return (
    <CardDetailModalProvider
      value={{
        cardId,
        boardId,
        cardListId,
        cardData: card,
        cardMembers: cardMembers,
        refetchCard: refetchCard,
        registerActionPopoverRef
      }}
    >
      <div ref={modalRef} className='w-[600px] max-w-screen-lg rounded-lg bg-white text-sm'>
        <CardModalHeader cardListId={cardListId} />
        <CardModalBody />
      </div>
    </CardDetailModalProvider>
  )
}

export default CardDetailModal
