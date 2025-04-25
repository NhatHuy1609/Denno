import React from 'react'
import ApproveRequestButton from './ApproveRequestButton'
import RejectRequestButton from './RejectRequestButton'

function RequestActions() {
  return (
    <div className='flex items-center gap-2'>
      <ApproveRequestButton />
      <RejectRequestButton />
    </div>
  )
}

export default RequestActions
