'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLoginGoogleMutation } from '@/app/_features/signin/SignInForm'
import {
  updateCurrentUser,
  updateEntireSession
} from '@/store/features/session'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { messageError, messageInfo, setFixLoading } from '@/ui'

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

      if (status === 202) {
        const {
          message,
          userInfo: { email, fullName, avatar }
        } = data
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
        const {
          accessToken,
          refreshToken,
          userInfo: { id, email, fullName, avatar }
        } = data

        dispatch(
          updateEntireSession({
            session: {
              token: accessToken as string,
              refreshToken: refreshToken as string
            },
            currentUser: {
              id: id as string,
              email,
              fullName,
              avatar
            }
          })
        )

        router.push('/general')
      }
    },
    onError: (error) => {
      const { message } = getErrorMessage(error)

      messageError(`${message || ''}. Please try again.`)
      router.replace('/sign-in')
    }
  })

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
