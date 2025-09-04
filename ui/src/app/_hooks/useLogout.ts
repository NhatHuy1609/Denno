import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { clearSession } from '@/store/features/session'
import useRevokeTokenMutation from './mutation/auth/useRevokeTokenMutation'

export const useLogout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { mutateAsync: revokeTokenAsync } = useRevokeTokenMutation({
    onError: (error) => {
      console.error(error)
    }
  })

  const clearPersistedStates = () => {
    localStorage.clear()
  }

  const logout = async () => {
    router.replace('/sign-in')

    clearPersistedStates() // Clear local storage
    dispatch(clearSession()) // Reset session slice
    await revokeTokenAsync()
  }

  return {
    logout
  }
}
