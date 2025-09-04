'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useBoardsByWorkspace } from '@/app/_hooks/query'
import WorkspaceBoardList from '@/app/_features/Board/List/WorkspaceBoardList'
import WorkspaceInfoCard from '@/app/_features/Workspaces/Info'
import DefaultEmptyBoardSection from './components/DefaultEmptyBoardSection'
import WorkspaceUpdateForm from '@/app/_features/Workspaces/Update/WorkspaceUpdateForm'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'

function page() {
  const { workspaceId } = useParams()
  const [showWorkspaceUpdateForm, setShowWorkspaceUpdateForm] = useState(false)
  const { data: boards = [], isLoading: isLoadingBoards } = useBoardsByWorkspace(workspaceId as string)

  const handleHideForm = () => {
    setShowWorkspaceUpdateForm(false)
  }

  const renderHeaderSection = () => {
    if (showWorkspaceUpdateForm) return <WorkspaceUpdateForm hideFormFn={handleHideForm} />
    return <WorkspaceInfoCard setShowWorkspaceUpdateForm={setShowWorkspaceUpdateForm} />
  }

  const renderContentSection = () => {
    if (isLoadingBoards) return <WaterFallLoading />
    return boards?.length > 0 ? <WorkspaceBoardList /> : <DefaultEmptyBoardSection />
  }

  return (
    <div className='w-full'>
      <section className='border-b border-gray-300 p-8 pb-6'>{renderHeaderSection()}</section>
      <section className='p-4 pr-0'>{renderContentSection()}</section>
    </div>
  )
}

export default page
