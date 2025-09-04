import React, { useState } from 'react'
import { Popover } from '@/ui'
import { cn } from '@/lib/styles/utils'

type PopoverActionProps = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
  contentClassName?: string
}

function PopoverAction({ renderTrigger, renderContent, contentClassName }: PopoverActionProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Popover.Popover onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>{renderTrigger()}</Popover.Trigger>
      <Popover.Content className={cn(contentClassName)}>{renderContent(handleClose)}</Popover.Content>
    </Popover.Popover>
  )
}

export default PopoverAction
