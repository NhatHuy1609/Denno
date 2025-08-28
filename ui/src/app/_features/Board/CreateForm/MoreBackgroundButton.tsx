import React from 'react'
import dynamic from 'next/dynamic'
import { IoIosMore } from 'react-icons/io'
import NavigationMenu from '@/app/_components/NavigationMenu'
import DefaultLazyFallbackComp from '@/app/_components/DefaultLazyFallbackComp'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'

const MoreBackgroundSelection = dynamic(() => import('./MoreBackgroundSelection'), {
  ssr: false,
  loading: () => <DefaultLazyFallbackComp />
})

function MoreBackgroundButton() {
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <button
          type='button'
          className='flex aspect-[3/2] w-[80px] cursor-pointer items-center justify-center rounded-sm bg-gray-300 hover:brightness-[0.8]'
        >
          <IoIosMore className='text-sm' />
        </button>
      )}
      renderContent={(closeModalFn) => (
        <NavigationMenu title='Board background' onClosePopover={closeModalFn}>
          <MoreBackgroundSelection />
        </NavigationMenu>
      )}
      contentConfigs={{
        side: 'right'
      }}
      contentClassName='px-0'
    />
  )
}

export default MoreBackgroundButton
