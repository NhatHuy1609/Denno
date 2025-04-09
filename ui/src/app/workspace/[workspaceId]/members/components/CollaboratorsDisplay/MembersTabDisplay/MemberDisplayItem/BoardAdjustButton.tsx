import React, { useState } from 'react'
import { Popover } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'
import NavigationMenu from '@/app/_components/NavigationMenu'
import PopoverAction from './PopoverAction'

type BoardAdjustButtonProps = {
  userId: string
  userName: string
  boardCount: number
}

export default function BoardAdjustButton({
  userId,
  userName,
  boardCount
}: BoardAdjustButtonProps) {
  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton intent='secondary' size='small' value={`${boardCount} boards`} />
      )}
      renderContent={(closePopoverFn) => (
        <BoardAdjustPanel userId={userId} userName={userName} closePopoverFn={closePopoverFn} />
      )}
    />
  )
}

type BoardAdjustPanelProps = {
  userId: string
  userName: string
  closePopoverFn: () => void
}

function BoardAdjustPanel({ closePopoverFn }: BoardAdjustPanelProps) {
  return (
    <NavigationMenu title='Workspace boards' onClosePopover={closePopoverFn}>
      <p className='text-sm text-black'>Huy David is a member of the following Workspace boards:</p>
    </NavigationMenu>
  )
}
