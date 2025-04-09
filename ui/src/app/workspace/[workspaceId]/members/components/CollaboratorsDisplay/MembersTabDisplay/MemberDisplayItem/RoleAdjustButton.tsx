import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PopoverAction from './PopoverAction'

export default function RoleAdjustButton() {
  return (
    <PopoverAction
      renderTrigger={() => <CustomizableButton intent='secondary' size='small' value={`Normal`} />}
      renderContent={(closePopoverFn) => <div></div>}
    />
  )
}
