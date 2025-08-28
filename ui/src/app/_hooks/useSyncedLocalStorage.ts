import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { defaultPersistedStateValues, PersistedStateValues } from '@/data/local-storage/persisted-values'
import { useState, useEffect, useCallback } from 'react'

export const useSyncedLocalStorage = <T extends PersistedStateKey>(
  key: T,
  initialValue?: PersistedStateValues[T]
): [
  PersistedStateValues[T],
  (value: PersistedStateValues[T] | ((val: PersistedStateValues[T]) => PersistedStateValues[T])) => void
] => {
  const [storedValue, setStoredValue] = useState<PersistedStateValues[T]>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue ? initialValue : defaultPersistedStateValues[key]
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue ? initialValue : defaultPersistedStateValues[key]
    }
  })

  const setValue = useCallback(
    (value: PersistedStateValues[T] | ((val: PersistedStateValues[T]) => PersistedStateValues[T])) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))

        // Trigger storage event for other listeners which are listening to this key to update their values
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore),
            oldValue: window.localStorage.getItem(key),
            storageArea: window.localStorage
          })
        )
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Listen for changes to the key in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
