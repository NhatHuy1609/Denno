import React from 'react'
import PopoverAction from './PopoverAction'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { FaAngleDown } from 'react-icons/fa6'
import { useMemberDisplayItemContext } from './context'

export default function RoleAdjustButton() {
  const { member } = useMemberDisplayItemContext()
  const { memberType: role } = member

  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          value={`${role}`}
          className='flex w-24 justify-center px-2'
          endIcon={<FaAngleDown className='text-base' />}
        />
      )}
      renderContent={(closePopoverFn) => <div></div>}
    />
  )
}
