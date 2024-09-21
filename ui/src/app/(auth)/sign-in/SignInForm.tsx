import React, { useState } from 'react'
import GoogleIcon from '../../../../public/google.png'
import Link from 'next/link'
import Image from 'next/image'
import { Form, Button } from '@/ui'
import { LuMail } from 'react-icons/lu'
import PasswordInput from '@/app/_components/PasswordInput'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='absolute z-[100] w-[36%] rounded-lg bg-white px-12 py-8 shadow-[0px_0px_20px_rgba(0,0,0,0.05)]'>
      <p className='mb-4 text-center text-3xl font-semibold'>Welcome back!</p>
      <div className='flex-col'>
        <Button
          block
          title='Continue with google'
          leadingIcon={<Image src={GoogleIcon} alt='google-image' className='mr-4 size-6' />}
        />
      </div>
      <div className='my-4 flex items-center'>
        <span className='h-px flex-1 bg-stone-300'></span>
        <span className='mx-3 text-sm text-stone-400'>OR</span>
        <span className='h-px flex-1 bg-stone-300'></span>
      </div>
      <form className='flex flex-col gap-4'>
        <Form.Input
          size='lg'
          value={email}
          icon={<LuMail className='text-gray-400' />}
          title='Work Email'
          placeholder='Enter your work email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          size='lg'
          title='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button block primary title='Login' size='lg' className='mt-3 text-sm' />
      </form>
      <div className='mt-3 flex items-center justify-center gap-2'>
        <span className='text-sm'>Don't have an account ?</span>
        <Link href='/sign-up' className='text-sm font-semibold text-blue-600 hover:opacity-80'>
          Go to sign up page
        </Link>
      </div>
    </div>
  )
}

export default SignInForm
