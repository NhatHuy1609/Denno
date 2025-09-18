import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import React, { useEffect, useRef } from 'react'
import { useCardDetailModalContext } from '../../../context'

type CardPopoverActionWrapperProps = {} & React.ComponentProps<typeof PopoverActionWrapper>

function CardPopoverActionWrapper({
  renderContent,
  renderTrigger,
  contentConfigs,
  contentClassName
}: CardPopoverActionWrapperProps) {
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
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      contentConfigs={contentConfigs}
      contentClassName={contentClassName}
    />
  )
}

export default CardPopoverActionWrapper
