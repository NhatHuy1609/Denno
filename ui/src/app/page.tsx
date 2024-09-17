import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div className='p-4 w-full'>
      <Link href='/sign-in' className='bg-sky-500 text-white rounded-md p-2 hover:opacity-90'>
        Go to login page
      </Link>
      <p className='mt-3'>Denno home page</p>
    </div>
  )
}

export default Home
