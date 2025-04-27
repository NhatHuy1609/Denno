import React from 'react'
import HeaderSection from './HeaderSection'
import RequestList from './RequestList'

function RequestsManager() {
  return (
    <div className='w-full'>
      <HeaderSection />
      <RequestList />
    </div>
  )
}

export default RequestsManager
