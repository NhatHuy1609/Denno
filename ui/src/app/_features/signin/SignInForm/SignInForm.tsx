'use client'

import React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { useForm, Controller } from 'react-hook-form'
import { useLoginMutation } from './signin.mutation'
import { authTypesDto, authContractsDto, authApiLib } from '@/service/api/auth'
import { LuMail, LuLock } from 'react-icons/lu'
import { Form, Button, messageError, messageInfo } from '@/ui'
import SignInGoogleButton from './SignInGoogleButton'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useResendCodeMutation } from '../../Signup/SignUpVerificationForm/resendcode.mutation'

type SignInFormValues = authTypesDto.LoginUserDto

function SignInForm() {
  const router = useRouter()
  const { email } = useAppSelector((state) => state.session.currentUser)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormValues>({
    resolver: zodResolver(authContractsDto.LoginUserDtoSchema)
  })

  const { mutate: resendRegisterCode } = useResendCodeMutation()

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (response) => {
      const status = response.status
      const data = response?.data
      const userName = data?.user?.userName

      // Redirect to the page where the user was before logging in
      const redirectAfterLoginPath = getLocalStorageItem(PersistedStateKey.RedirectAfterLogin)
      if (redirectAfterLoginPath) {
        router.push(redirectAfterLoginPath)
        return
      }

      if (status === 200) {
        router.push(`/u/${userName}/boards`)
      }
    },
    onError: (error) => {
      const { statusCode: status, message, errorType } = authApiLib.getDetailedError(error)
      if (status) {
        if (status === 401 && errorType === 'VerifyEmail') {
          messageInfo('You need to verify your email before logging into your account')
          resendRegisterCode({ email })
          router.push('/sign-up/validate-email')
        } else {
          messageError(message)
        }
      } else {
        messageError(message)
      }
    },
    onSettled: () => {
      setLocalStorageItem(PersistedStateKey.RedirectAfterLogin, '')
    }
  })

  const onSubmit = async (data: SignInFormValues) => {
    await login(data)
  }

  return (
    <div className='absolute z-[100] w-[36%] rounded-lg bg-white px-12 py-8 shadow-[0px_0px_20px_rgba(0,0,0,0.05)]'>
      <p className='mb-4 text-center text-3xl font-semibold'>Welcome back!</p>
      <div className='flex-col'>
        <SignInGoogleButton />
      </div>
      <div className='my-4 flex items-center'>
        <span className='h-px flex-1 bg-stone-300'></span>
        <span className='mx-3 text-sm text-stone-400'>OR</span>
        <span className='h-px flex-1 bg-stone-300'></span>
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name='email'
          render={({ field }) => (
            <Form.Input
              size='lg'
              icon={<LuMail className='text-gray-400' />}
              title='Work Email'
              placeholder='Enter your work email'
              onChange={field.onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field }) => (
            <Form.PasswordInput
              size='lg'
              title='Password'
              placeholder='Enter password'
              onChange={field.onChange}
              error={errors.password?.message}
              icon={<LuLock className='text-gray-400' />}
            />
          )}
        />
        <Button
          block
          primary
          type='submit'
          title='Login'
          size='lg'
          className='mt-3 text-sm'
          loading={isPending}
          disabled={isPending}
        />
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
