import React from 'react'
import LockImage from 'public/lock-image.png'
import Image from 'next/image'
import LoggedInSection from './LoggedInSection'
import CustomizableButton from '@/ui/components/CustomizableButton'

function PrivateBoardAccessRequest() {
  return (
    <div className='flex size-full items-center justify-center bg-gray-100'>
      <div className='min-w-[500px] rounded-sm bg-white p-6 shadow-md'>
        <Image src={LockImage} alt='lock-image' className='mx-auto w-[150px]' />
        <h1 className='text-center text-xl font-semibold text-black'>This board is private</h1>
        <p className='my-2 text-center text-sm'>
          Send a request to this board’s admins to get access. <br /> If you’re approved to join,
          you'll receive an email.
        </p>
        <LoggedInSection />
        <p className='my-2 text-xs text-gray-500'>
          By requesting access, you agree to share your Atlassian account information, <br />{' '}
          including your email address, with the board admins.
        </p>

        <CustomizableButton
          intent='primary'
          className='mt-4 flex w-full items-center justify-center'
          value='Send request'
          // loading
        />
      </div>
    </div>
  )
}

export default PrivateBoardAccessRequest
