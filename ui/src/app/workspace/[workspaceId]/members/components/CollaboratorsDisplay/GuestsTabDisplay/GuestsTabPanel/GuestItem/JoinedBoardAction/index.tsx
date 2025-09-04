import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import JoinedBoardPanel from './JoinedBoardPanel'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import { useGuestItemContext } from '../context'

export default function JoinedBoardsAction() {
  const { guestId = '', guestInfo, guestJoinedBoards } = useGuestItemContext()

  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <CustomizableButton
          intent='secondary'
          size='small'
          className='px-2'
          value={`View boards (${guestJoinedBoards?.length})`}
        />
      )}
      renderContent={(closePopoverFn) => (
        <JoinedBoardPanel userId={guestId} userName={guestInfo?.fullName || ''} closePopoverFn={closePopoverFn} />
      )}
      contentConfigs={{ side: 'top', align: 'center', sideOffset: 5 }}
    />
  )
}
