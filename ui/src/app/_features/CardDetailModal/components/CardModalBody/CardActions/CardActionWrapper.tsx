import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import React, { useEffect, useRef } from 'react'
import { useCardDetailModalContext } from '../../../context'

type Props = {
  icon: React.ReactNode
  label: string
  renderContent: () => React.ReactNode
} & Omit<React.ComponentProps<typeof PopoverActionWrapper>, 'renderTrigger'>

function CardActionWrapper({ icon, label, ...props }: Props) {
  const popoverContentRef = useRef<HTMLDivElement>(null)
  const { registerActionPopoverRef } = useCardDetailModalContext()

  useEffect(() => {
    if (popoverContentRef) {
      registerActionPopoverRef?.(popoverContentRef)
    }
  }, [popoverContentRef, registerActionPopoverRef])

  return (
    <PopoverActionWrapper
      ref={popoverContentRef}
      renderTrigger={() => (
        <button className='inline-flex items-center gap-2 rounded-sm border border-gray-300 bg-white px-2 py-1 hover:bg-gray-200'>
          {icon}
          <span className='text-sm font-medium text-gray-700'>{label}</span>
        </button>
      )}
      {...props}
    />
  )
}

export default CardActionWrapper
