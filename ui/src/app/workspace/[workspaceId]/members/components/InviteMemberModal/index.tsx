import React, { useState } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { Dialog } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'

import InviteMemberModalBody from './InviteMemberModalBody'

function InviteMemberModal() {
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false)

  const handleCloseModal = () => {
    setShowInviteMemberModal(false)
  }

  return (
    <Dialog.Dialog onOpenChange={setShowInviteMemberModal} open={showInviteMemberModal}>
      <Dialog.DialogTrigger asChild>
        <CustomizableButton
          value='Invite Workspace members'
          size='medium'
          intent='primary'
          startIcon={<AiOutlineUserAdd />}
        />
      </Dialog.DialogTrigger>
      <Dialog.DialogContent aria-describedby={undefined} className='min-w-[640px]'>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <span className='text-xl font-normal'>Invite to Workspace</span>
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        {/* Body */}
        <InviteMemberModalBody closeModalFn={handleCloseModal} />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}

export default InviteMemberModal
