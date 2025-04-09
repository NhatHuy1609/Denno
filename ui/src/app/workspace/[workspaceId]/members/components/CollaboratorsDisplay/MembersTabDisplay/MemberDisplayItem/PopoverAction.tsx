import React, { useState } from 'react'
import { Popover } from '@/ui'

type PopoverActionProps = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
}

function PopoverAction({ renderTrigger, renderContent }: PopoverActionProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Popover.Popover onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>{renderTrigger()}</Popover.Trigger>
      <Popover.Content>{renderContent(handleClose)}</Popover.Content>
    </Popover.Popover>
  )
}

export default PopoverAction
