import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMe } from './query/user/useMe'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { setLocalStorageItem } from '@/utils/local-storage'

export const useRequireAuth = (redirectUrl: string = '/sign-in') => {
  const router = useRouter()
  const { data: currentUser, isLoading, isError } = useMe()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        // Store the current URL to redirect to after login
        setLocalStorageItem(PersistedStateKey.RedirectAfterLogin, window.location.href)

        router.replace(redirectUrl)
      } else {
        setIsCheckingAuth(false)
      }
    }
  }, [currentUser, isLoading, router])

  return { currentUser, isError, isCheckingAuth }
}
