import React from 'react'
import { cn } from '@/lib/styles/utils'

interface TabButtonProps {
  title: string
  isActive: boolean
  onClick: () => void
  quantity?: number
}

function TabButton({ title, isActive, onClick, quantity = 0 }: TabButtonProps) {
  return (
    <div
      className={cn(
        'mb-[-2px] flex cursor-pointer items-center gap-1 border-b-2 border-transparent py-1 hover:text-gray-300',
        {
          'border-blue-500 hover:border-blue-500': isActive
        }
      )}
      onClick={onClick}
    >
      <span
        className={cn('text-sm font-semibold text-gray-600', {
          'text-blue-500 hover:text-gray-600': isActive
        })}
      >
        {title}
      </span>
      {quantity > 0 && (
        <span
          className={cn(
            'inline-block flex size-5 items-center justify-center rounded-full bg-gray-300 p-1 text-xs text-gray-600'
          )}
        >
          {quantity}
        </span>
      )}
    </div>
  )
}

export default TabButton
