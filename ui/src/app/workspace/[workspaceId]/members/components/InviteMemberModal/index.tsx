import React from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { Dialog } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'

import InviteMemberModalBody from './InviteMemberModalBody'

function InviteMemberModal() {
  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild>
        <CustomizableButton
          value='Invite Workspace members'
          size='medium'
          intent='primary'
          startIcon={<AiOutlineUserAdd />}
        />
      </Dialog.DialogTrigger>
      <Dialog.DialogContent aria-describedby={undefined}>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <span className='text-xl font-normal'>Invite to Workspace</span>
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        {/* Body */}
        <InviteMemberModalBody />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}

export default InviteMemberModal
