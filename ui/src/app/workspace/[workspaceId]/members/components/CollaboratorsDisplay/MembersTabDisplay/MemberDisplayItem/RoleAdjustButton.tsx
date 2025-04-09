import React from 'react'
import PopoverAction from './PopoverAction'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaAngleDown } from 'react-icons/fa6'

export default function RoleAdjustButton() {
  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value={`Normal`}
          className='px-4'
          endIcon={<FaAngleDown className='text-base' />}
        />
      )}
      renderContent={(closePopoverFn) => <div></div>}
    />
  )
}
