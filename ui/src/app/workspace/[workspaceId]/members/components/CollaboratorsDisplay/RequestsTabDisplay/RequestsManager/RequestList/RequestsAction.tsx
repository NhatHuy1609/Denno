import React from 'react'
import ApproveRequestButton from './ApproveRequestButton'
import RejectRequestButton from './RejectRequestButton'

function RequestsAction() {
  return (
    <div className='flex gap-2'>
      <ApproveRequestButton />
      <RejectRequestButton />
    </div>
  )
}

export default RequestsAction
