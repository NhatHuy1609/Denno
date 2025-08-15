'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import WorkspaceBoardList from '@/app/_features/Board/List/WorkspaceBoardList'
import WorkspaceInfoCard from '@/app/_features/Workspaces/Info'
import { useBoardsByWorkspace } from '@/app/_hooks/query'
import DefaultEmptyBoardSection from './components/DefaultEmptyBoardSection'
import WorkspaceUpdateForm from '@/app/_features/Workspaces/Update/WorkspaceUpdateForm'

function page() {
  const { workspaceId } = useParams()
  const [showWorkspaceUpdateForm, setShowWorkspaceUpdateForm] = useState(false)
  const { data: boards = [] } = useBoardsByWorkspace(workspaceId as string)

  const handleHideForm = () => {
    setShowWorkspaceUpdateForm(false)
  }

  console.log('WORKSPACE BOARDS: ', boards)

  return (
    <div className='w-full'>
      <section className='border-b border-gray-300 p-8 pb-6'>
        {showWorkspaceUpdateForm ? (
          <WorkspaceUpdateForm hideFormFn={handleHideForm} />
        ) : (
          <WorkspaceInfoCard setShowWorkspaceUpdateForm={setShowWorkspaceUpdateForm} />
        )}
      </section>
      <section className='p-4 pr-0'>
        {boards?.length > 0 ? <WorkspaceBoardList /> : <DefaultEmptyBoardSection />}
      </section>
    </div>
  )
}

export default page
