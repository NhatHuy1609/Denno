import React from 'react'
import { TiStarOutline } from 'react-icons/ti'
import CustomizableButton from '@/ui/components/CustomizableButton'
import TooltipWrapper from '@/app/_components/TooltipWrapper'

function FavourButton() {
  return (
    <TooltipWrapper
      content={
        <>
          Click to star or unstar this board. Starred <br /> boards show up at the top of your
          boards list.
        </>
      }
      side='bottom'
      sideOffset={4}
    >
      <CustomizableButton
        intent='icon'
        size='icon'
        startIcon={<TiStarOutline className='text-lg text-white' />}
        className='h-full hover:bg-white/20'
      />
    </TooltipWrapper>
  )
}

export default FavourButton
