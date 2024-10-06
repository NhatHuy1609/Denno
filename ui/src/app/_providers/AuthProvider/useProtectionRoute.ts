import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { userTypes } from '@/entities/user'

const publicRoutes = [
  '/general',
  '/sign-in',
  '/google-sign-in',
  '/sign-up',
  '/sign-up/validate-email',
  '/sign-up/complete-signup'
]

const useProtectionRoute = ({ user }: { user: userTypes.User | null }) => {
  const router = useRouter()
  const path = usePathname()

  const onAuth = (pathName: string) => {
    const isInSession = user?.id
    const isInPublicRoute = publicRoutes.includes(pathName)

    if (!isInPublicRoute && !isInSession) {
      return router.replace('/sign-in')
    }
  }

  useEffect(() => {
    user && onAuth(path)
  }, [path, user])
}

export default useProtectionRoute