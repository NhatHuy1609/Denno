import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export const useUser = () => {
  const { user } = useContext(AuthContext)

  return { user }
}
