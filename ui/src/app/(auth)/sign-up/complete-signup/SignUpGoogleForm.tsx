'use client'

import React, { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiLib, authTypesDto } from '@/service/api/auth'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { sessionStoreLib, updateSession } from '@/store/features/session'
import { useForm, Controller } from 'react-hook-form'
import { useRegisterUserMutation } from '../../../_features/Signup/SignUpForm/signup.mutation'
import { LuLock } from 'react-icons/lu'
import { Button, Form, messageError } from '@/ui'
import AvatarInput from './AvatarInput'

const SignUpGoogleSchema = z.object({
  password: z
    .string({ required_error: 'Password required!' })
    .min(8, { message: 'Password must be 8 characters or longer!' }),
  avatar: z.instanceof(File, { message: 'Avatar must be a file' })
})

type FormValues = z.infer<typeof SignUpGoogleSchema>

function SignUpGoogleForm() {
  const { email, avatar, fullName } = useAppSelector((state) => state.session.currentUser)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(SignUpGoogleSchema)
  })

  const { mutate: registerUser, isPending } = useRegisterUserMutation({
    onSuccess: async (response) => {
      const sessionData = sessionStoreLib.transformRegisterResponseDtoToSession(response.data)
      dispatch(updateSession(sessionData))

      router.push('/general')
    },
    onError: (error) => {
      const { field, message } = authApiLib.getDetailedError(error)
      if (field === 'Password') {
        setError(field.toLowerCase() as 'password', { type: 'custom', message })
      } else {
        messageError(message)
      }
    }
  })

  useEffect(() => {
    if (!email || !avatar || !fullName) {
      router.replace('/sign-up')
    }
  }, [email, avatar, fullName])

  const onSubmit = (data: FormValues) => {
    const user: authTypesDto.RegisterUserDto = {
      email,
      fullName,
      password: data.password,
      avatar: data.avatar
    }

    registerUser(user)
  }

  return (
    <div className='absolute z-[100] max-w-[450px] rounded-md bg-white px-10 py-8 shadow-[0px_0px_20px_rgba(0,0,0,0.05)]'>
      <div className='inline-flex w-full justify-center gap-4 align-middle'>
        <h3 className='text-center text-2xl font-medium'>Complete</h3>
        <span className='relative text-center text-2xl font-medium text-white after:absolute after:left-[-10%] after:z-[-1] after:h-full after:w-[120%] after:-skew-x-12 after:bg-cyan-400'>
          sign up!
        </span>
      </div>
      <form className='mt-6 w-full' onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-6 flex flex-col items-center gap-4'>
          <Controller
            name='avatar'
            control={control}
            render={({ field: { onChange, ref } }) => (
              <AvatarInput size='lg' initialImage={avatar} onChange={onChange} ref={ref} />
            )}
          />
          <p className='text-center'>
            Hi <span className='font-medium text-sky-500'>{fullName}</span>, complete your account
            registration by entering a password
          </p>
        </div>

        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <Form.PasswordInput
              size='lg'
              onChange={field.onChange}
              error={errors.password?.message}
              placeholder='Enter your password'
              icon={<LuLock className='text-gray-400' />}
            />
          )}
        />

        <Button
          block
          primary
          size='base'
          type='submit'
          title='Complete'
          loading={isPending}
          disabled={isPending}
          className='mt-6 size-full'
        />
      </form>
    </div>
  )
}

export default SignUpGoogleForm
