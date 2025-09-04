import React from 'react'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaXmark } from 'react-icons/fa6'
import RemoveGuestPanel from './RemoveGuestPanel'

function RemoveGuestAction() {
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value='Remove guest'
          className='max-w-[108px] px-2'
          valueClassName='truncate'
          startIcon={<FaXmark className='text-base' />}
        />
      )}
      renderContent={() => <RemoveGuestPanel />}
      contentClassName='px-1 py-2'
      contentConfigs={{ side: 'top', align: 'center', sideOffset: 5 }}
    />
  )
}

export default RemoveGuestAction
