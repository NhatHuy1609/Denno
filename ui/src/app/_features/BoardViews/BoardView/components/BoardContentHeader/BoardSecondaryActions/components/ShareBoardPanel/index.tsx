import React, { useState } from 'react'
import { Dialog } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { TbUserShare } from 'react-icons/tb'
import ShareBoardModalBody from './ShareBoardModalBody'
import { useBoardQuery } from '@/app/_hooks/query'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

function ShareBoardPanel() {
  const boardId = getLocalStorageItem(PersistedStateKey.RecentAccessBoard)
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false)
  const { data: boardData } = useBoardQuery(boardId, {
    includeJoinRequests: true
  })
  const joinRequestsNumber = boardData?.joinRequests.length || 0

  const handleCloseModal = () => {
    setShowInviteMemberModal(false)
  }

  return (
    <Dialog.Dialog onOpenChange={setShowInviteMemberModal} open={showInviteMemberModal}>
      <Dialog.DialogTrigger asChild>
        <div className='flex items-center gap-2'>
          <CustomizableButton
            className='bg-white'
            size='medium'
            value='Share'
            intent='ghost'
            startIcon={<TbUserShare className='text-black' />}
            renderOtherItems={() =>
              joinRequestsNumber > 0 ? (
                <span className='block flex size-6 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                  {joinRequestsNumber}
                </span>
              ) : null
            }
          />
        </div>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent aria-describedby={undefined} className='min-w-[640px]'>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <span className='text-xl font-normal'>Share board</span>
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        {/* Body */}
        <ShareBoardModalBody />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}

export default ShareBoardPanel
