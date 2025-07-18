import CustomizableButton from '@/ui/components/CustomizableButton'
import React from 'react'
import { IoIosMore } from 'react-icons/io'

function BoardOptionMenu() {
  return (
    <>
      <CustomizableButton
        intent='ghost'
        size='medium'
        className='hover:bg-white/20'
        startIcon={<IoIosMore className='text-xl text-white' />}
      />
    </>
  )
}

export default BoardOptionMenu
