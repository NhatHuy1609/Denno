'use client'

import React from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useRegisterUserMutation } from './signup.mutation'
import { authContractsDto, authTypesDto } from '@/service/api/auth'
import { authApiLib } from '@/service/api/auth'
import { LuMail, LuUser2, LuLock } from 'react-icons/lu'
import { Button, Form, messageError, setFixLoading } from '@/ui'
import SignInGoogleButton from '../../Signin/SignInForm/SignInGoogleButton'
import AvatarInput from '@/app/(auth)/sign-up/complete-signup/AvatarInput'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

type RegisterUserFormData = authTypesDto.RegisterUserDto

export default function SignUpForm() {
  const router = useRouter()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(authContractsDto.RegisterUserDtoSchema)
  })

  const { mutate: registerUser, isPending } = useRegisterUserMutation({
    onSuccess: async (response) => {
      const redirectAfterLoginPath = getLocalStorageItem(PersistedStateKey.RedirectAfterLogin)
      if (redirectAfterLoginPath) {
        router.push(redirectAfterLoginPath)
        return
      }

      if (response.status === 200) {
        setFixLoading(true)
        router.push('/sign-up/validate-email')
        setFixLoading(false)
      }
    },
    onError(error) {
      const { message, field } = authApiLib.getDetailedError(error)
      if (field) {
        setError(field.toLowerCase() as 'email' | 'password', {
          type: 'custom',
          message
        })
      } else {
        messageError(message)
      }
    },
    onSettled: () => {
      setLocalStorageItem(PersistedStateKey.RedirectAfterLogin, '/')
    }
  })

  const onSubmit = (data: RegisterUserFormData) => {
    registerUser(data)
  }

  return (
    <div className='absolute z-[100] w-[36%] rounded-lg bg-white px-12 py-8 shadow-[0px_0px_20px_rgba(0,0,0,0.05)]'>
      <p className='mb-4 text-center text-3xl font-semibold'>Seconds to sign up!</p>
      <div className='flex-col'>
        <SignInGoogleButton />
      </div>
      <div className='my-4 flex items-center'>
        <span className='h-px flex-1 bg-stone-300'></span>
        <span className='mx-3 text-sm text-stone-400'>OR</span>
        <span className='h-px flex-1 bg-stone-300'></span>
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex w-full flex-col items-center gap-2'>
          <Controller
            name='avatar'
            control={control}
            render={({ field: { onChange, ref } }) => (
              <AvatarInput size='lg' onChange={onChange} ref={ref} />
            )}
          />
          <span className='text-sm font-medium text-black'>Choose your avatar</span>
        </div>

        <Controller
          name='fullName'
          control={control}
          render={({ field }) => (
            <Form.Input
              size='lg'
              icon={<LuUser2 className='text-gray-400' />}
              title='Full Name'
              placeholder='John Doe'
              onChange={field.onChange}
              error={errors.fullName?.message}
            />
          )}
        />
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <Form.Input
              size='lg'
              icon={<LuMail className='text-gray-400' />}
              title='Work Email'
              placeholder='example@gmail.com'
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
              placeholder='Minimum 8 characters'
              icon={<LuLock className='text-gray-400' />}
              onChange={field.onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Button
          block
          primary
          size='lg'
          type='submit'
          disabled={isPending}
          loading={isPending}
          title='Create account'
          className='text-md mt-3'
        />
      </form>
      <div className='mt-3 flex items-center justify-center gap-2'>
        <span className='text-sm'>Already have an account ?</span>
        <Link href='/sign-in' className='text-sm font-semibold text-blue-600 hover:opacity-80'>
          Log in
        </Link>
      </div>
    </div>
  )
}
