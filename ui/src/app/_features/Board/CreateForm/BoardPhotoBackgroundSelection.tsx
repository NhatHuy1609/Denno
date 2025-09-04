import React from 'react'
import { cn } from '@/lib/styles/utils'
import { PHOTOS_BACKGROUND } from '@/data/board-photo-backgrounds'
import { useBoardCreateForm } from './context'
import { FaCheck } from 'react-icons/fa6'
import type { BoardPhotoBackgroundImage } from '@/data/board-photo-backgrounds'
import Image from 'next/image'

function PhotoBackgroundSelectionItem({
  item,
  showOwner = false
}: {
  item: BoardPhotoBackgroundImage
  showOwner?: boolean
}) {
  const { setFormValue, backgroundSource } = useBoardCreateForm()
  const { url: backgroundUrl, photographerName, photographerUrl } = item

  const isBackgroundSelected = backgroundSource === backgroundUrl

  const handleSelectPhotoBackground = () => {
    setFormValue('background', backgroundUrl)
  }

  return (
    <div
      onClick={handleSelectPhotoBackground}
      className='group relative aspect-[3/2] w-full overflow-hidden rounded-sm'
    >
      <Image src={backgroundUrl} fill alt={photographerName} loading='lazy' className='absolute inset-0' />
      <div className='absolute inset-0 hidden bg-[rgba(0,0,0,0.2)] group-hover:block'></div>
      {showOwner && (
        <div className='absolute bottom-0 left-0 z-10 hidden w-full p-1 text-left group-hover:block'>
          <a
            target='_blank'
            href={photographerUrl}
            className='block w-full overflow-hidden text-ellipsis whitespace-nowrap bg-black/50 text-xs text-white underline'
          >
            {photographerName}
          </a>
        </div>
      )}
      {isBackgroundSelected && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <FaCheck className='text-xs text-white' />
        </div>
      )}
    </div>
  )
}

function BoardPhotoBackgroundSelection({
  photoQuantity,
  showOwner = false,
  className
}: {
  photoQuantity: number
  showOwner?: boolean
  className?: string
}) {
  const showedPhotosQuantity = Math.min(photoQuantity, PHOTOS_BACKGROUND.length)

  return (
    <div className={cn('flex w-full gap-1', className)}>
      {PHOTOS_BACKGROUND.slice(0, showedPhotosQuantity).map((item, index) => (
        <PhotoBackgroundSelectionItem item={item} key={index} showOwner={showOwner} />
      ))}
    </div>
  )
}

export default BoardPhotoBackgroundSelection
