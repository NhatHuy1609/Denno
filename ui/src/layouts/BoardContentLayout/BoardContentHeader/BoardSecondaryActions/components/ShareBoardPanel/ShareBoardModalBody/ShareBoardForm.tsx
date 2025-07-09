import React, { useRef } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import CustomizableButton from '@/ui/components/CustomizableButton'
import DropdownMenuPrimary from '@/app/_components/DropdownMenuPrimary'

function ShareBoardForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const dropdownItems = [
    {
      title: 'Member',
      description: 'Boards must have at least one admin.'
    },
    {
      title: 'Admin',
      description: ''
    },
    {
      title: 'Observer',
      description: 'Add people with limited permissions to this board.'
    },
    {
      title: 'Leave board',
      description: 'Boards must have at least one admin.'
    }
  ]

  return (
    <div className='flex w-full gap-2'>
      <div className='flex flex-1 items-center justify-between gap-2'>
        <PrimaryInputText
          ref={inputRef}
          className='w-full border-[1.5px] border-gray-500 p-2'
          placeholder='Email address or name'
        />
        <DropdownMenuPrimary triggerTitle='Member' items={dropdownItems} />
      </div>
      <CustomizableButton value='Share' className='h-full min-w-[120px] justify-center py-[10px]' />
    </div>
  )
}

export default ShareBoardForm
