import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PopoverAction from './PopoverAction'
import { FaXmark } from 'react-icons/fa6'

function UserRemoveButton() {
  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value={`Remove`}
          className='px-4'
          startIcon={<FaXmark className='text-base' />}
        />
      )}
      renderContent={(closePopoverFn) => <div></div>}
    />
  )
}

export default UserRemoveButton
