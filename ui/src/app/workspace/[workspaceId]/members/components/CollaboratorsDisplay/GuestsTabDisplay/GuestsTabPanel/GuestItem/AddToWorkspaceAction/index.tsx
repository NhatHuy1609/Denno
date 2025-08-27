import React from 'react'
import { FaXmark } from 'react-icons/fa6'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import AddToWorkspacePanel from './AddToWorkspacePanel'

function AddToWorkspaceAction() {
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value='Add to workspace'
          className='max-w-[108px] px-2'
          valueClassName='truncate'
          startIcon={<FaXmark className='text-base' />}
        />
      )}
      renderContent={(closePopoverFn) => <AddToWorkspacePanel closePanelFn={closePopoverFn} />}
      contentConfigs={{ side: 'top', align: 'center', sideOffset: 5 }}
    />
  )
}

export default AddToWorkspaceAction
