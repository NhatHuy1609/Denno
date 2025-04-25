import React from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import CustomizableButton from '@/ui/components/CustomizableButton'

function RejectRequestButton() {
  return (
    <CustomizableButton
      intent='icon'
      className='h-8 rounded-sm bg-white text-black hover:bg-gray-200'
      startIcon={<HiOutlineXMark className='text-lg font-medium' />}
    />
  )
}

export default RejectRequestButton
