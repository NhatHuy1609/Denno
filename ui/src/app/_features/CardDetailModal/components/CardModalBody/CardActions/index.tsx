import React from 'react'
import CardMemberAction from './CardMemberAction'
import CardDatesAction from './CardDatesAction'

function CardActions() {
  return (
    <div className='mt-6 flex gap-2'>
      <CardMemberAction />
      <CardDatesAction />
    </div>
  )
}

export default CardActions
