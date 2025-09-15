import React from 'react'
import CardActionWrapper from './CardActionWrapper'
import { MdGroupAdd } from 'react-icons/md'
import CardMemberActionPanel from '../CardActionPanels/CardMemberActionPanel'

function CardMemberAction() {
  return (
    <CardActionWrapper
      icon={<MdGroupAdd />}
      label='Members'
      renderContent={() => <CardMemberActionPanel />}
      contentConfigs={{
        side: 'bottom'
      }}
    />
  )
}

export default CardMemberAction
