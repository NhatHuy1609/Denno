import React from 'react'
import CardActionWrapper from './CardActionWrapper'
import { LuClock5 } from 'react-icons/lu'
import CardDatesActionPanel from '../CardActionPanels/CardDatesActionPanel'

function CardDatesAction() {
  return (
    <CardActionWrapper
      icon={<LuClock5 />}
      label='Dates'
      renderContent={() => <CardDatesActionPanel />}
      contentConfigs={{
        side: 'right'
      }}
    />
  )
}

export default CardDatesAction
