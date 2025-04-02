'use client'

import React, { useState } from 'react'
import InviteMemberModal from './components/InviteMemberModal'
import WorkspaceInfoCard from '@/app/_features/Workspaces/Info'
import WorkspaceUpdateForm from '@/app/_features/Workspaces/Update/WorkspaceUpdateForm'

function WorkspaceMembersPage() {
  const [showWorkspaceUpdateForm, setShowWorkspaceUpdateForm] = useState(false)

  const handleHideForm = () => {
    setShowWorkspaceUpdateForm(false)
  }

  return (
    <section className='w-full p-8 pb-6'>
      <div className='flex w-full justify-between gap-3 border-b border-gray-300 px-12 pb-4'>
        <div>
          {showWorkspaceUpdateForm ? (
            <WorkspaceUpdateForm hideFormFn={handleHideForm} />
          ) : (
            <WorkspaceInfoCard
              showDescription
              setShowWorkspaceUpdateForm={setShowWorkspaceUpdateForm}
            />
          )}
        </div>

        <div className='size-auto'>
          <InviteMemberModal />
        </div>
      </div>
    </section>
  )
}

export default WorkspaceMembersPage
