import { cn } from '@/lib/styles/utils'
import React from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa6'

type Props = {
  onClick?: () => void
  isStarred: boolean
  className?: string
}

function StarButton({ onClick, isStarred, className }: Props) {
  return (
    <button type='button' onClick={onClick} className={cn('transition-all hover:scale-[1.25]', className)}>
      {isStarred ? <FaStar className={'text-lg text-amber-400'} /> : <FaRegStar className={'text-lg text-amber-400'} />}
    </button>
  )
}

export default StarButton
