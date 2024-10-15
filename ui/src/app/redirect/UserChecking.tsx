'use client'
import { useEffect } from 'react'

function UserChecking() {
  useEffect(() => {
    const location = window.location
    location.href = `${location.protocol}//${location.host}/general`
  }, [])

  return <></>
}

export default UserChecking
