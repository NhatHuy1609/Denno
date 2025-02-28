import React, { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { IoIosMore } from 'react-icons/io'
import { Popover } from '@/ui'
import NavigationMenu from '@/app/_components/NavigationMenu'
import DefaultLazyFallbackComp from '@/app/_components/DefaultLazyFallbackComp'

const MoreBackgroundSelection = dynamic(() => import('./MoreBackgroundSelection'), {
  ssr: false,
  loading: () => <DefaultLazyFallbackComp />
})

function MoreBackgroundButton() {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleClosePopover = () => {
    setPopoverOpen(false)
  }

  return (
    <div className='aspect-[3/2] w-[80px] rounded-sm bg-gray-300 hover:brightness-[0.8]'>
      <Popover.Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Popover.Trigger className='size-full' asChild>
          <div className='flex cursor-pointer items-center justify-center'>
            <IoIosMore className='text-sm' />
          </div>
        </Popover.Trigger>
        <Popover.Content side='right' className='px-0'>
          <NavigationMenu title='Board background' onClosePopover={handleClosePopover}>
            <MoreBackgroundSelection />
          </NavigationMenu>
        </Popover.Content>
      </Popover.Popover>
    </div>
  )
}

export default MoreBackgroundButton
