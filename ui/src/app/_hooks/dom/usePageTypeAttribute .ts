import { useEffect } from "react"

export const usePageTypeAttribute = (pageType: string) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-page', pageType)

    return () => {
      document.documentElement.setAttribute('data-page', 'default')
    }
  })
}