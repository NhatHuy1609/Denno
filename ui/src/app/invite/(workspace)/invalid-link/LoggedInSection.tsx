import CustomizableButton from '@/ui/components/CustomizableButton'
import React from 'react'

function LoggedInSection() {
  return (
    <div className='mt-2 w-[600px]'>
      <h3 className='mt-6 text-center text-xl font-medium'>You can't join this Workspace</h3>
      <p className='my-3 text-center text-base'>
        The invitation link may have been disabled or this free Workspace may <br /> have reached
        the 10 collaborator limit. Try contacting the person who sent <br /> you the link for more
        info.
      </p>

      <div className='mt-6 flex justify-center'>
        <CustomizableButton intent='primary' size='medium' value='Request to join this workspace' />
      </div>
    </div>
  )
}

export default LoggedInSection
