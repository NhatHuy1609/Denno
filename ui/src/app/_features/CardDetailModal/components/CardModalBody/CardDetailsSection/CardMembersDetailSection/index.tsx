import React from 'react'
import DetailSectionWrapper from '../DetailSectionWrapper'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import { Avatar } from '@/ui'
import { BsPlusLg } from 'react-icons/bs'
import CardPopoverActionWrapper from '../CardPopoverActionWrapper'
import CardMemberActionPanel from '../../CardActionPanels/CardMemberActionPanel'

function CardMembersDetailSection() {
  const { cardMembers = [] } = useCardDetailModalContext()

  if (cardMembers.length === 0) {
    return null
  }

  return (
    <DetailSectionWrapper label='Members'>
      <div className='flex w-auto gap-2'>
        <div className='flex gap-1'>
          {cardMembers.map((member) => (
            <Avatar size='sm' key={member.id} src={member.avatar} name={member.fullName} />
          ))}
        </div>
        <CardPopoverActionWrapper
          renderTrigger={() => (
            <button className='flex size-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300'>
              <BsPlusLg />
            </button>
          )}
          renderContent={() => <CardMemberActionPanel />}
        />
      </div>
    </DetailSectionWrapper>
  )
}

export default CardMembersDetailSection
