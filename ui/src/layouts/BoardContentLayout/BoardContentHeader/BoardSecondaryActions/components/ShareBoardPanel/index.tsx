import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { TbUserShare } from 'react-icons/tb'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'

function ShareBoardPanel() {
  return (
    <CustomizableButton
      className='bg-white'
      size='medium'
      value='Share'
      intent='ghost'
      startIcon={<TbUserShare className='text-black' />}
    />
  )
}

export default ShareBoardPanel
