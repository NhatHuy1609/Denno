import React from 'react'
import InviteMemberModalBody from './InviteMemberModalBody'
import DialogWrapper from '@/app/_components/DialogWrapper'

type Props = {
  renderTrigger: () => React.ReactNode
}

function WorkspaceInviteMemberModal({ renderTrigger }: Props) {
  return (
    <DialogWrapper
      renderTrigger={renderTrigger}
      renderContent={(closeModalFn) => (
        <div className='w-auto bg-white'>
          <InviteMemberModalBody closeModalFn={closeModalFn} />
        </div>
      )}  
      title='Invite to Workspace'
    />
  )
}

export default WorkspaceInviteMemberModal
