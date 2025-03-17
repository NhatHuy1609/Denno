import React from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { Dialog } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

function InviteMemberModal() {
  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger>
        <CustomizableButton
          value='Invite Workspace members'
          size='medium'
          intent='primary'
          startIcon={<AiOutlineUserAdd />}
        />
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>
            <span className='text-xl font-normal'>Invite to Workspace</span>
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        {/* Body */}
        <div className='flex w-full'>
          <PrimaryInputText
            className='w-full border border-gray-500 p-2'
            placeholder='Email address or name'
          />
        </div>
        <div className='h-16'></div>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
}

export default InviteMemberModal
