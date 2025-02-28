import React from 'react'
import Image from 'next/image'

const COLORS = [
  '#FF6F61', // coralPink
  '#6B5B95', // deepLavender
  '#88B04B', // leafyGreen
  '#F7CAC9', // blushPink
  '#92A8D1', // softBlue
  '#955251', // dustyRose
  '#B565A7', // violetPlum
  '#009B77', // tropicalTeal
  '#DD4124', // fieryRed
  '#D65076', // orchidPurple
  '#45B8AC', // seafoamGreen
  '#EFC050', // goldenSun
  '#5B5EA6', // royalBlue
  '#9B2335', // brickRed
  '#DFCFBE', // lightCream
  '#BC243C', // crimsonRed
  '#E15D44', // sunsetOrange
  '#55B4B0', // mintGreen
  '#2A4B7C', // navyBlue
  '#D94F70', // rosePink
  '#EFC94C', // lemonYellow
  '#F52549', // brightCrimson
  '#17A398', // tealGreen
  '#F39A27', // amberOrange
  '#0779E4', // skyBlue
  '#C70039', // scarletRed
  '#06BEE1', // brightCyan
  '#FED766', // softYellow
  '#26C485', // emeraldGreen
  '#FF715B' // salmonPink
]

const getLinearBackground = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const firstColorIndex = Math.abs(hash) % name.length
  const secondColorIndex = firstColorIndex + 6 > COLORS.length - 1 ? 0 : firstColorIndex + 6

  return `linear-gradient(${COLORS[firstColorIndex]}, ${COLORS[secondColorIndex]})`
}

type AvatarSizes = 'sm' | 'base' | 'lg'

type IWorkspaceAvatarProps = {
  name: string
  imageUrl?: string | null
  size?: AvatarSizes
  className?: string
}

const sizes: { [key in AvatarSizes]: string } = {
  sm: 'size-6 text-base',
  base: 'size-8 text-xl',
  lg: 'size-[60px] text-4xl'
}

function WorkspaceLogo({
  name = '',
  imageUrl = '',
  size = 'base',
  className
}: IWorkspaceAvatarProps) {
  const classes = ['rounded-sm overflow-hidden']

  size && classes.push(sizes[size])
  className && classes.push(className)

  const defaultLogoBackground = getLinearBackground(name)
  const defaultLogoLetter = name.slice(0, 1)

  return (
    <div className={classes.join(' ')}>
      {!imageUrl && (
        <div
          className='flex size-full items-center justify-center'
          style={{ background: defaultLogoBackground }}
        >
          <span className='block h-auto font-medium text-white'>{defaultLogoLetter}</span>
        </div>
      )}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt='workspace-image'
          className='object-fit size-full'
          width={100}
          height={100}
        />
      )}
    </div>
  )
}

export default WorkspaceLogo
