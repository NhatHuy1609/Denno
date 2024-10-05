'use client'

import React from 'react'
import { z } from 'zod'
import { cn } from '@/lib/styles/utils'
import Image from 'next/image'
import MailLogo from 'public/mail-image.png'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAppSelector } from '@/store/hooks'
import { useValidateRegisterUserMutation } from './verification.mutation'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { Button, messageError, messageSuccess } from '@/ui'
import SignUpVerificationOTP from './SignUpVerificationOTP'

const VerificationOTPSchema = z.object({
  digit1: z.string().length(1, 'Required').regex(/^\d+$/, 'Must be a number'),
  digit2: z.string().length(1, 'Required').regex(/^\d+$/, 'Must be a number'),
  digit3: z.string().length(1, 'Required').regex(/^\d+$/, 'Must be a number'),
  digit4: z.string().length(1, 'Required').regex(/^\d+$/, 'Must be a number')
})

export type FormValues = z.infer<typeof VerificationOTPSchema>
export type FormKeys = keyof FormValues

function SignUpVerificationForm() {
  const router = useRouter()
  const { email } = useAppSelector((state) => state.session.currentUser)

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(VerificationOTPSchema)
  })

  const { mutate: validateRegister, isPending } = useValidateRegisterUserMutation({
    onSuccess: async (response) => {
      if (response.status === 200) {
        messageSuccess('Account registration verification successful.')
        router.replace('/general')
      }
    },
    onError: (error) => {
      const { message } = getErrorMessage(error)
      messageError(message)
    }
  })

  const isFormError = Object.keys(errors).length > 0
  const fieldNames: FormKeys[] = Object.keys(VerificationOTPSchema.shape) as FormKeys[]

  // Handle submit otp code after validation
  const onSubmit = (data: FormValues) => {
    let otpCode = Object.values(data).join('')
    validateRegister({
      email,
      code: otpCode
    })
  }

  return (
    <div className='absolute z-[100] w-[36%] min-w-[400px] rounded-lg bg-white px-12 py-8 shadow-[0px_0px_20px_rgba(0,0,0,0.05)]'>
      <div className='w-full'>
        <p className='mb-4 text-center text-3xl font-semibold'>Seconds to verify!</p>
        <div className='flex justify-center'>
          <Image priority={true} src={MailLogo} alt='email logo' className='size-1/2' />
        </div>
        <span className='text-2xl'>We just emailed you.</span>
        <div className='mt-6 flex flex-col gap-2'>
          <p className='block text-sm text-stone-400'>Please enter the code we emailed you.</p>
          <span className='text-sm'>{email}</span>
        </div>
        <span
          className={cn(
            'mt-4 block text-sm font-medium',
            `${isFormError ? 'text-red-500' : 'text-black'}`
          )}
        >
          Confirmation code
        </span>
      </div>

      <form
        autoComplete='off'
        className='mt-6 flex flex-col gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <SignUpVerificationOTP
          setValue={setValue}
          fieldList={fieldNames}
          control={control}
          error={isFormError}
        />
        <Button
          block
          primary
          size='lg'
          type='submit'
          title='Verify'
          loading={isPending}
          disabled={isPending}
          className='text-md mt-3 font-semibold'
        />
      </form>
    </div>
  )
}

export default SignUpVerificationForm
