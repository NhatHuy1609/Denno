import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PopoverAction from '../PopoverAction'
import JoinedBoardPanel from './JoinedBoardPanel'

type JoinedBoardActionProps = {
  userId: string
  userName: string
  boardCount: number
}

export default function JoinedBoardAction({ userId, userName, boardCount }: JoinedBoardActionProps) {
  return (
    <PopoverAction
      renderTrigger={() => (
        <CustomizableButton intent='secondary' size='small' className='px-2' value={`View boards (${boardCount})`} />
      )}
      renderContent={(closePopoverFn) => (
        <JoinedBoardPanel userId={userId} userName={userName} closePopoverFn={closePopoverFn} />
      )}
    />
  )
}
