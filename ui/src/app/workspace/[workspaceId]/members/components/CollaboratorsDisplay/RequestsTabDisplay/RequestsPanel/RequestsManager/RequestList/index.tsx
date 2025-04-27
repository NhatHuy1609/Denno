import React from 'react'
import { useRequestsManagerContext } from '../../context'
import RequestItem from './RequestItem'

function RequestList() {
  const { workspaceJoinRequests, setSelectedRequests, selectedRequests } =
    useRequestsManagerContext()

  // console.log('SELECTED REQUESTS: ', selectedRequests)

  const handleSelectRequest = (requestId: number) => {
    if (selectedRequests.includes(requestId)) {
      setSelectedRequests((prevSelectedRequests) =>
        prevSelectedRequests.filter((id) => id !== requestId)
      )
    } else {
      setSelectedRequests((prevSelectedRequests) => [...prevSelectedRequests, requestId])
    }
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      {workspaceJoinRequests.map((joinRequest) => (
        <RequestItem
          key={joinRequest.id}
          joinRequest={joinRequest}
          selectRequestFn={handleSelectRequest}
          isSelected={selectedRequests.includes(joinRequest.id)}
        />
      ))}
    </div>
  )
}

export default RequestList
