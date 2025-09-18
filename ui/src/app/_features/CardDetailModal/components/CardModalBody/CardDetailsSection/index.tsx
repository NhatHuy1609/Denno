import React from 'react'
import CardMembersDetailSection from './CardMembersDetailSection'
import CardDatesDetailSection from './CardDatesDetailSection'

function CardDetailsSection() {
  return (
    <div className='mt-4 flex w-auto items-start gap-6'>
      <CardMembersDetailSection />
      <CardDatesDetailSection />
    </div>
  )
}

export default CardDetailsSection
