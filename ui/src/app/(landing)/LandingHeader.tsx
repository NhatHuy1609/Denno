import React from 'react'
import Link from 'next/link'
import { httpGet } from '@/service/api/_req'

function LandingHeader() {
  const links = [
    { title: 'Features', href: '#' },
    { title: 'Pricing', href: '#' },
    { title: 'Templates', href: '#' }
  ]

  const handleGetMe = async () => {
    const response = await httpGet('/user/get-me')
    console.log(response)
  }

  return (
    <header className='flex w-full justify-between bg-white px-10 py-3'>
      <div
        onClick={handleGetMe}
        className='h-16 w-[100px] cursor-pointer bg-red-500 hover:opacity-90'
      ></div>
      <div className='flex items-center'>
        <Link href='/'>
          <div className='mr-20'>
            <p className='text-black'>Denno</p>
          </div>
        </Link>
        <ul className='flex list-none items-center gap-10'>
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='font-medium hover:text-blue-500'
            >
              {link.title}
            </Link>
          ))}
        </ul>
      </div>

      <div className='flex items-center gap-4'>
        <Link
          href='/sign-in'
          className='rounded-md p-3 text-sm font-medium text-blue-500 hover:bg-stone-100'
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}

export default LandingHeader
