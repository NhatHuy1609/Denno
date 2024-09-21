'use client'

import axios from 'axios'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authorizationCode = searchParams.get('code')

  useEffect(() => {
    const handleGetGoogleAccessToken = async (authorizationCode: string) => {
      const response = await axios.post(`https://localhost:7097/api/v1/auth/google-sign-in`, {
        authorizationCode
      })

      console.log(response)

      // if (response.status === 200) {
      //   router.replace('/')
      // }
    }

    if (authorizationCode) {
      handleGetGoogleAccessToken(authorizationCode)
    }
  }, [authorizationCode])

  return <div>page</div>
}

export default Home
