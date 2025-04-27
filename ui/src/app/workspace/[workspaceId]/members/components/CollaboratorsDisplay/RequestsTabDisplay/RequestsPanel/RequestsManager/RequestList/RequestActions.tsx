import React from 'react'
import ApproveRequestButton from './ApproveRequestButton'
import RejectRequestButton from './RejectRequestButton'

type Props = {
  requestId: number
}

function RequestActions({ requestId }: Props) {
  return (
    <div className='flex items-center gap-2'>
      <ApproveRequestButton requestId={requestId} />
      <RejectRequestButton requestId={requestId} />
    </div>
  )
}

export default RequestActions
