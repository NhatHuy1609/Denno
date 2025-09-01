import React, { useState } from 'react'
import { cn } from '@/lib/styles/utils'

type Props = {
  unreadStatus: boolean
  onToggle: (unreadStatus: boolean) => void
}

function ToggleReadStatusButton({ unreadStatus, onToggle }: Props) {
  const handleToggle = () => {
    onToggle(!unreadStatus)
  }

  return (
    <div className='flex gap-2'>
      <span className='text-xs text-gray-400'>Only show unread</span>
      <button
        type='button'
        onClick={handleToggle}
        className={cn(
          // Base styles
          'relative h-[18px] w-[32px] rounded-full transition-colors duration-200 ease-in-out',
          'focus:outline-none',
          // Background color based on state
          unreadStatus ? 'bg-green-600' : 'bg-slate-500',
          // Toggle thumb styles
          'after:absolute after:start-[2px] after:top-[2px] after:size-[14px]',
          "after:rounded-full after:border after:bg-white after:transition-all after:duration-200 after:content-['']",
          // Thumb position and border based on state
          unreadStatus ? 'after:translate-x-full after:border-white' : 'after:border-gray-300'
        )}
        aria-checked={unreadStatus}
        role='switch'
        aria-label='Toggle unread notifications only'
      ></button>
    </div>
  )
}

export default ToggleReadStatusButton
