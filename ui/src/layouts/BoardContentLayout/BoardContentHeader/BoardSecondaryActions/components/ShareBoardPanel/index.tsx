import React, { useState } from 'react'
import { Dialog } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { TbUserShare } from 'react-icons/tb'
import ShareBoardModalBody from './ShareBoardModalBody'

function ShareBoardPanel() {
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false)

  const handleCloseModal = () => {
    setShowInviteMemberModal(false)
  }

  return (
    <Dialog.Dialog onOpenChange={setShowInviteMemberModal} open={showInviteMemberModal}>
      <Dialog.DialogTrigger asChild>
        <CustomizableButton
          className='bg-white'
          size='medium'
          value='Share'
          intent='ghost'
          startIcon={<TbUserShare className='text-black' />}
        />
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
