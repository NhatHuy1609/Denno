import React, { useState } from 'react'
import CardActionWrapper from './CardActionWrapper'
import { LuClock5 } from 'react-icons/lu'
import CardDatesActionPanel from '../CardActionPanels/CardDatesActionPanel'

function CardDatesAction() {
  return (
    <CardActionWrapper
      icon={<LuClock5 />}
      label='Dates'
      renderContent={(closeFn) => <CardDatesActionPanel onClosePanel={closeFn} />}
      contentConfigs={{
        side: 'right'
      }}
      contentClassName='w-fit'
    />
  )
}

export default CardDatesAction
