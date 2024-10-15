import React, { createContext } from 'react'
import { useAppSelector } from '@/store/hooks'
import { userTypes } from '@/entities/user'
import useProtectionRoute from './useProtectionRoute'

interface IAuthContext {
  user: userTypes.User | null
}

export const AuthContext = createContext<IAuthContext>({
  user: null
})

function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.session.currentUser)

  // Handle protected route
  // useProtectionRoute({ user })

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
