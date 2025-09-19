'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { useSearchParams, useRouter } from 'next/navigation'
import { updateCurrentUser } from '@/store/features/session'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { messageError, messageInfo, setFixLoading } from '@/ui'
import { useLoginGoogleMutation } from '@/app/_features/Signin/SignInForm/signin-google.mutation'

const Home = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  const authorizationCode = searchParams.get('code')
  const googleSigninError = searchParams.get('error')

  const { mutate: loginGoogle } = useLoginGoogleMutation({
    onMutate: () => {
      setFixLoading(true)
    },
    onSettled: () => {
      setFixLoading(false)
    },
    onSuccess: async (response) => {
      const { status, data } = response
      const {
        message,
        userInfo: { email, fullName, avatar, userName }
      } = data

      if (status === 202) {
        dispatch(
          updateCurrentUser({
            email,
            avatar,
            fullName
          })
        )

        router.push('/sign-up/complete-signup')
        messageInfo(message)
      } else if (status === 200) {
        router.push(`/u/${userName}/boards`)
      }
    },
    onError: (error) => {
      const { message } = getErrorMessage(error)

      messageError(`${message || ''}. Please try again.`)
      router.replace('/sign-in')
    }
  })

  // This effect handles the Google sign-in process.
  // It checks if the authorization code is present in the URL and calls the loginGoogle mutation with it.
  useEffect(() => {
    const handleGetGoogleAccessToken = async (authorizationCode: string) => {
      await loginGoogle({ authorizationCode })
    }

    if (authorizationCode) {
      handleGetGoogleAccessToken(authorizationCode)
    } else {
      router.replace('sign-in')
    }
  }, [authorizationCode])

  useEffect(() => {
    if (googleSigninError) {
      router.replace('/sign-in')
    }
  }, [googleSigninError])

  return <></>
}

export default Home
