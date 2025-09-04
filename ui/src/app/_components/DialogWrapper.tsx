import React, { useState } from 'react'
import { Dialog } from '@/ui'
import { DialogContentProps } from '@radix-ui/react-dialog'
import { cn } from '@/lib/styles/utils'

type Props = {
  renderTrigger: () => React.ReactNode
  renderContent: (closeFn: () => void) => React.ReactNode
  title?: string
  description?: string
  contentClassName?: string
  contentConfigs?: Partial<DialogContentProps>
}

function DialogWrapper({ renderTrigger, renderContent, title, description, contentClassName, contentConfigs }: Props) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog.Dialog onOpenChange={setOpen} open={open}>
      <Dialog.DialogTrigger asChild>{renderTrigger()}</Dialog.DialogTrigger>
      <Dialog.DialogContent
        {...contentConfigs}
        className={cn('min-w-[640px]', contentClassName)}
        aria-describedby={description ? undefined : undefined}
      >
        {(title || description) && (
          <Dialog.DialogHeader>
            {title && (
              <Dialog.DialogTitle>
                <span className='text-xl font-normal'>{title}</span>
              </Dialog.DialogTitle>
            )}
            {description && <Dialog.DialogDescription>{description}</Dialog.DialogDescription>}
          </Dialog.DialogHeader>
        )}
        {renderContent(handleClose)}
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}

export default DialogWrapper
