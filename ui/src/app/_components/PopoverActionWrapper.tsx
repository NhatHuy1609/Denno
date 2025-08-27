import React, { useState } from 'react'
import { Popover } from '@/ui'
import { PopoverContentProps } from '@radix-ui/react-popover'

type Props = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
  contentClassName?: string
  contentConfigs?: Partial<PopoverContentProps>
}

function PopoverActionWrapper({ renderTrigger, renderContent, contentClassName, contentConfigs }: Props) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Popover.Popover onOpenChange={setOpen} open={open}>
      <Popover.Trigger asChild>{renderTrigger()}</Popover.Trigger>
      <Popover.Content {...contentConfigs} className={contentClassName}>
        {renderContent(handleClose)}
      </Popover.Content>
    </Popover.Popover>
  )
}

export default PopoverActionWrapper
