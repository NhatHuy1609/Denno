import React from 'react'
import type { userSchemas } from '@/entities/user'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import useAssignCardMemberMutation from '@/app/_hooks/mutation/card/useAssignCardMemberMutation'
import { Avatar } from '@/ui'

type Props = {
  member: userSchemas.User
}

function BoardMemberDisplayItem({ member }: Props) {
  const { id: memberId } = member
  const { cardId = '', refetchCard, cardMembers } = useCardDetailModalContext()
  const { mutateAsync: assignCardMemberAsync } = useAssignCardMemberMutation({
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      refetchCard?.()
    }
  })

  const handleAssignCardMember = async () => {
    await assignCardMemberAsync({
      id: cardId,
      assignCardMemberDto: {
        assignedMemberId: memberId
      }
    })
  }

  if (cardMembers?.some((member) => member.id === memberId)) {
    return null
  }

  return (
    <div
      onClick={handleAssignCardMember}
      key={member.id}
      className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-200'
    >
      <Avatar size='sm' src={member.avatar} name={member.fullName} />
      <span className='text-sm font-semibold text-gray-800'>{member.fullName}</span>
    </div>
  )
}

export default BoardMemberDisplayItem
