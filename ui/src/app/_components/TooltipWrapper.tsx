import React, { ReactNode } from 'react'
import { TooltipContent, TooltipTrigger, Tooltip } from '@/ui/components/Tooltip'
import { TooltipContentProps } from '@radix-ui/react-tooltip'

interface TooltipWrapperProps {
  children: ReactNode
  content: ReactNode | string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  delayDuration?: number
  className?: string
  contentProps?: Omit<TooltipContentProps, 'children' | 'side' | 'sideOffset' | 'className'>
  disabled?: boolean
}

function TooltipWrapper({
  children,
  content,
  side = 'bottom',
  sideOffset = 4,
  delayDuration,
  className,
  contentProps,
  disabled = false
}: TooltipWrapperProps) {
  const renderContent = () => {
    if (typeof content === 'string') {
      return <span>{content}</span>
    }

    return content
  }

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} className={className} {...contentProps}>
        {renderContent()}
      </TooltipContent>
    </Tooltip>
  )
}

export default TooltipWrapper
