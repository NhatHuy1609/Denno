import React, { useState } from 'react'
import { Popover } from '@/ui'

type Props = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
}

function PopoverActionWrapper({ renderTrigger, renderContent }: Props) {
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

export default PopoverActionWrapper
