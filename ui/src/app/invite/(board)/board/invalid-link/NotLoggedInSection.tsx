import React from 'react'

function NotLoggedInSection() {
  return (
    <div className='mt-2 w-[600px]'>
      <h3 className='my-6 text-center text-xl font-medium'>You can't join this Board</h3>
      <p className='text-center text-base'>
        The invitation link may have been disabled or this free Board may <br /> have reached the 10
        collaborator limit. Try contacting the person who sent <br /> you the link for more info.
      </p>
    </div>
  )
}

export default NotLoggedInSection
