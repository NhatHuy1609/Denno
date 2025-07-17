import { useRouter } from "next/navigation"
import { useMe } from "./query/user/useMe"
import { useEffect } from "react"

export const useRequireAuth = (redirectUrl: string = '/sign-in') => {
  const router = useRouter()
  const { data: currentUser, isLoading, isError } = useMe()

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace(redirectUrl)
    }
  }, [currentUser, isLoading, router]) 

  return { currentUser, isLoading, isError }
}