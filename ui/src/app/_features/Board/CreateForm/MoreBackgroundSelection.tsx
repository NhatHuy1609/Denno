import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'
import { useNavigationMenu } from '@/app/_components/NavigationMenu/context'
import BoardPhotoBackgroundSelection from './BoardPhotoBackgroundSelection'
import DefaultLazyFallbackComp from '@/app/_components/DefaultLazyFallbackComp'
import { BoardLinearPaletteBackgroundSelection } from './BoardPaletteBackgroundSelection'

const MorePhotosBackgroundSelection = dynamic(() => import('./MorePhotoBackgroundSelection'), {
  ssr: false,
  loading: () => <DefaultLazyFallbackComp />
})

const MoreColorBackgroundSelection = dynamic(() => import('./MoreColorBackgroundSelection'), {
  ssr: false,
  loading: () => <DefaultLazyFallbackComp />
})

function MoreBackgroundSection({
  title,
  children,
  subMenuComp,
  subMenuTitle
}: {
  title: string
  children: ReactNode
  subMenuComp: ReactNode
  subMenuTitle: string
}) {
  const { handleSelectItem } = useNavigationMenu()

  const handleOpenSubMenu = () => {
    handleSelectItem({
      menuTitle: subMenuTitle,
      contentComp: subMenuComp
    })
  }

  return (
    <div className='mt-4 w-full'>
      <div className='mb-2 flex w-full items-center justify-between'>
        <h4 className='text-sm font-semibold'>{title}</h4>
        <button
          onClick={handleOpenSubMenu}
          className='rounded-sm bg-gray-200 px-2 py-[6px] text-sm font-medium hover:bg-gray-300'
        >
          See more
        </button>
      </div>
      {children}
    </div>
  )
}

function MoreBackgroundSelection() {
  const { selectedItemsHistory } = useNavigationMenu()

  const currentSelectedItem = selectedItemsHistory[selectedItemsHistory.length - 1]

  const renderSelectItemContent = () => {
    const contentComp = currentSelectedItem?.contentComp
    return <div className='mt-2'>{contentComp}</div>
  }

  const renderInitialContent = () => (
    <div className='px-4'>
      <MoreBackgroundSection
        title='Photos'
        subMenuTitle='Photos by Unsplash'
        subMenuComp={<MorePhotosBackgroundSelection />}
      >
        <BoardPhotoBackgroundSelection
          showOwner={true}
          photoQuantity={6}
          className='grid grid-cols-3 gap-2'
        />
      </MoreBackgroundSection>
      <MoreBackgroundSection
        title='Colors'
        subMenuTitle='Colors'
        subMenuComp={<MoreColorBackgroundSelection />}
      >
        <BoardLinearPaletteBackgroundSelection
          colorQuantity={6}
          className='grid grid-cols-3 gap-2'
        />
      </MoreBackgroundSection>
    </div>
  )

  return (
    <div className='w-full'>
      {currentSelectedItem ? renderSelectItemContent() : renderInitialContent()}
    </div>
  )
}

export default MoreBackgroundSelection
