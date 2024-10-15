import React, { useEffect, useState } from 'react'
import GoogleIcon from 'public/google.png'
import { Button, messageError } from '@/ui'
import Image from 'next/image'
import { AuthService } from '@/service/api/auth'
import { getErrorMessage } from '@/service/api/_getErrorMessage'

export default function SignInGoogleButton() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (url) {
      window.location.href = url
    }
  }, [url])

  const handleGetGoogleLoginUrl = () => {
    AuthService.getGoogleLoginUrl()
      .then((response) => {
        const redirectUrl: string = response?.data
        setUrl(redirectUrl)
      })
      .catch((error) => {
        const { message } = getErrorMessage(error)
        messageError(message)
      })
  }

  return (
    <Button
      block
      onClick={handleGetGoogleLoginUrl}
      title='Continue with google'
      leadingIcon={
        <Image src={GoogleIcon} alt='google-image' className='mr-4 size-6' />
      }
    />
  )
}
