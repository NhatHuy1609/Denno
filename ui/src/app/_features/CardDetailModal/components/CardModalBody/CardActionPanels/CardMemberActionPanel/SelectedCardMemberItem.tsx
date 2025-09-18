import React, { useCallback } from 'react'
import { userSchemas } from '@/entities/user'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import useRemoveCardMemberMutation from '@/app/_hooks/mutation/card/useRemoveCardMemberMutation'
import { Avatar } from '@/ui'
import { HiXMark } from 'react-icons/hi2'

type Props = {
  member: userSchemas.User
}

function SelectedCardMemberItem({ member }: Props) {
  const { cardId, refetchCard } = useCardDetailModalContext()
  const { mutateAsync: removeCardMemberAsync } = useRemoveCardMemberMutation({
    onSuccess: () => {
      refetchCard?.()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const handleRemoveCardMember = useCallback(() => {
    if (!cardId) return

    removeCardMemberAsync({
      id: cardId,
      removeCardMemberDto: {
        memberId: member.id
      }
    })
  }, [cardId, member.id, removeCardMemberAsync])

  return (
    <div
      onClick={handleRemoveCardMember}
      key={member.id}
      className='relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-200'
    >
      <Avatar size='sm' src={member.avatar} name={member.fullName} />
      <span className='text-sm font-semibold text-gray-800'>{member.fullName}</span>

      <div className='absolute right-4 top-1/2 -translate-y-1/2'>
        <HiXMark className='text-lg text-gray-700' />
      </div>
    </div>
  )
}

export default SelectedCardMemberItem
