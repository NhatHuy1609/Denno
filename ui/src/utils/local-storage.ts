// Cách 1: Kiểm tra typeof window
export function setLocalStorageItem(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }
}

export function getLocalStorageItem(key: string) {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : undefined
    } catch (error) {
      console.log(error)
    }
  }
  return undefined
}
