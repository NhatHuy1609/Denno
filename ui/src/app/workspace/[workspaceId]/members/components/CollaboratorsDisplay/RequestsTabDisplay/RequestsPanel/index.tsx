import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/styles/utils'
import { useParams } from 'next/navigation'
import { useJoinRequestsQuery } from '@/app/_hooks/query/workspace/useJoinRequestsQuery'
import { RequestsManagerProvider } from './context'
import RequestsManager from './RequestsManager'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

function RequestsPanel() {
  const inputRef = useRef<HTMLInputElement>(null)

  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: workspaceJoinRequests = [], isLoading: isLoadingWorkspaceJoinRequests } =
    useJoinRequestsQuery(workspaceId)

  // State for managing selected requests
  const [selectedRequests, setSelectedRequests] = useState<number[]>([])
  const [joinRequestsDisplay, setJoinRequestsDisplay] = useState(workspaceJoinRequests)

  // Synchronize joinRequestsDisplay with workspaceJoinRequests
  useEffect(() => {
    setJoinRequestsDisplay(workspaceJoinRequests)
  }, [workspaceJoinRequests])

  const handleChangeFilterInput = () => {
    const searchedName = inputRef.current?.value ?? ''
    const filteredJoinRequests = workspaceJoinRequests.filter((request) => {
      return request.requester.fullName.toLowerCase().includes(searchedName.toLowerCase())
    })
    setJoinRequestsDisplay(filteredJoinRequests)
  }

  const handleSelectAllRequests = () => {
    if (selectedRequests.length === joinRequestsDisplay.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(joinRequestsDisplay.map((request) => request.id))
    }
  }

  return (
    <div className='mt-4 w-full'>
      {!isLoadingWorkspaceJoinRequests && workspaceJoinRequests.length <= 0 && (
        <p className='text-center italic text-gray-400'>There are no join requests</p>
      )}
      <PrimaryInputText
        ref={inputRef}
        placeholder='Filter by name'
        onChange={handleChangeFilterInput}
        className={cn('w-[250px] border border-black p-2')}
      />
      <RequestsManagerProvider
        value={{
          workspaceJoinRequests: joinRequestsDisplay,
          selectedRequests,
          setSelectedRequests,
          selectAllRequestsFn: handleSelectAllRequests
        }}
      >
        <RequestsManager />
      </RequestsManagerProvider>
    </div>
  )
}

export default RequestsPanel
