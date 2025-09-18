import React, { forwardRef, useState } from 'react'
import { Popover } from '@/ui'
import { PopoverContentProps } from '@radix-ui/react-popover'
import { cn } from '@/lib/styles/utils'

type Props = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
  contentClassName?: string
  contentConfigs?: Partial<PopoverContentProps>
}

const PopoverActionWrapper = forwardRef<HTMLDivElement, Props>(
  ({ renderTrigger, renderContent, contentClassName, contentConfigs }, ref) => {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
      setOpen(false)
    }

    return (
      <Popover.Popover onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>{renderTrigger()}</Popover.Trigger>
        <Popover.Content {...contentConfigs} className={cn(contentClassName)} ref={ref}>
          {renderContent(handleClose)}
        </Popover.Content>
      </Popover.Popover>
    )
  }
)

export default PopoverActionWrapper
