import React from 'react'
import { cn } from '@/lib/styles/utils'

type UnderlineLinkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

function UnderlineLinkButton({ value, onClick, className }: UnderlineLinkButtonProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        'w-fit cursor-pointer text-xs font-medium text-blue-600 underline decoration-transparent underline-offset-1 hover:decoration-inherit',
        className
      )}
    >
      {value}
    </button>
  )
}

export default UnderlineLinkButton
