import React from 'react'
import HeaderActionWrapper from '../HeaderActionWrapper'
import { useLogout } from '@/app/_hooks/useLogout'

function LogoutSection() {
  const { logout: logoutAsync } = useLogout()

  const handleClickLogoutButton = async () => {
    await logoutAsync()
  }

  return (
    <HeaderActionWrapper>
      <button type='button' className='size-full p-2 text-left' onClick={handleClickLogoutButton}>
        Log out
      </button>
    </HeaderActionWrapper>
  )
}

export default LogoutSection
