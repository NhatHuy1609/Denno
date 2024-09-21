'use client'
import axios from 'axios'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const EmailConfirmationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get('Email')
  const token = searchParams.get('Token')

  useEffect(() => {
    const handleConfirmRegisterAccountEmail = async (userId: string, token: string) => {
      const response = await axios.post('https://localhost:7097/api/v1/auth/confirm-register-email', {
        email,
        token
      })

      if (response.status === 200) {
        router.replace('/')
      }
    }

    if (email && token) {
      handleConfirmRegisterAccountEmail(email, token)
    }
  }, [email, token])

  return <div>Email confirmation page</div>
}

export default EmailConfirmationPage
