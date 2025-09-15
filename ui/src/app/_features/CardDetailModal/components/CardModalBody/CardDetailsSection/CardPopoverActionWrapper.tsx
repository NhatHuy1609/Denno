import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import React, { useEffect, useRef } from 'react'
import { useCardDetailModalContext } from '../../../context'

type Props = {
  renderContent: () => React.ReactNode
  renderTrigger: () => React.ReactNode
}

function CardPopoverActionWrapper({ renderContent, renderTrigger }: Props) {
  const popoverContentRef = useRef<HTMLDivElement>(null)
  const { registerActionPopoverRef } = useCardDetailModalContext()

  useEffect(() => {
    if (popoverContentRef) {
      registerActionPopoverRef?.(popoverContentRef)
    }
  }, [popoverContentRef, registerActionPopoverRef])

  return <PopoverActionWrapper ref={popoverContentRef} renderContent={renderContent} renderTrigger={renderTrigger} />
}

export default CardPopoverActionWrapper
