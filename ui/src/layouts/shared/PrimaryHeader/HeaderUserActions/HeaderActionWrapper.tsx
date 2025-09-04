import { cn } from '@/lib/styles/utils'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

function HeaderActionWrapper({ children, className }: Props) {
  return (
    <div
      className={cn(
        'w-auto cursor-pointer overflow-hidden rounded-sm text-sm transition-all hover:bg-gray-200',
        className
      )}
    >
      {children}
    </div>
  )
}

export default HeaderActionWrapper
