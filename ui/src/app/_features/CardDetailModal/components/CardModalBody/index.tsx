import React from 'react'
import CardTitleRow from './CardTitleRow'
import CardActions from './CardActions'
import CardDetailsSection from './CardDetailsSection'

function CardModalBody() {
  return (
    <div className='w-full px-4 py-6'>
      <CardTitleRow />
      <div className='pl-10'>
        <CardActions />
        <CardDetailsSection />
      </div>
    </div>
  )
}

export default CardModalBody
