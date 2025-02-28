import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/styles/utils'
import type { BoardColorBackgroundImage } from '@/data/board-color-backgrounds'
import { LINEAR_PALETTE, SOLID_PALETTE } from '@/data/board-color-backgrounds'
import { useBoardCreateForm } from './context'
import { FaCheck } from 'react-icons/fa6'

function ColorBackgroundSelectionItem({
  background,
  type
}: {
  background: BoardColorBackgroundImage
  type: 'linear' | 'solid'
}) {
  const { setFormValue, backgroundSource } = useBoardCreateForm()

  const isBackgroundSelected = backgroundSource.includes(background.imageName)

  const handleSelectBackground = () => {
    const backgroundPath = `/board/backgrounds/colors/${type}/${background.imageName}.jpg`
    setFormValue('background', backgroundPath)
  }

  return (
    <div
      onClick={handleSelectBackground}
      className='relative aspect-[3/2] w-[80px] cursor-pointer overflow-hidden rounded-sm hover:brightness-[0.8]'
    >
      <Image
        src={background.imageSrc}
        alt={background.imageName}
        className='size-full object-cover'
      />
      {isBackgroundSelected && (
        <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)]'>
          <FaCheck className='text-xs text-white' />
        </div>
      )}
    </div>
  )
}

export function BoardSolidPaletteBackgroundSelection({
  colorQuantity,
  className
}: {
  colorQuantity: number | 'max'
  className?: string
}) {
  const showedColorQuantity =
    typeof colorQuantity === 'string' && colorQuantity === 'max'
      ? SOLID_PALETTE.length
      : Math.min(colorQuantity, SOLID_PALETTE.length)

  return (
    <div className={cn('flex w-full gap-1', className)}>
      {SOLID_PALETTE.slice(0, showedColorQuantity).map((color, index) => (
        <ColorBackgroundSelectionItem background={color} key={index} type='solid' />
      ))}
    </div>
  )
}

export function BoardLinearPaletteBackgroundSelection({
  colorQuantity,
  className
}: {
  colorQuantity: number | 'max'
  className?: string
}) {
  const showedColorQuantity =
    typeof colorQuantity === 'string' && colorQuantity === 'max'
      ? LINEAR_PALETTE.length
      : Math.min(colorQuantity, LINEAR_PALETTE.length)

  return (
    <div className={cn('flex w-full gap-1', className)}>
      {LINEAR_PALETTE.slice(0, showedColorQuantity).map((color, index) => (
        <ColorBackgroundSelectionItem background={color} key={index} type='linear' />
      ))}
    </div>
  )
}
