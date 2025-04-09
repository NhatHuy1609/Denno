import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PopoverAction from './PopoverAction'

function UserRemoveButton() {
  return (
    <PopoverAction
      renderTrigger={() => <CustomizableButton intent='secondary' size='small' value={`Remove`} />}
      renderContent={(closePopoverFn) => <div></div>}
    />
  )
}

export default UserRemoveButton
