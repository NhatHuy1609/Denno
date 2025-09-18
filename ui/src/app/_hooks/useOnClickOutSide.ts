import { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

// overloads
export function useOnClickOutside(ref: RefObject<HTMLElement>, handler: (event: Event) => void): void
export function useOnClickOutside(refs: RefObject<HTMLElement>[], handler: (event: Event) => void): void
export function useOnClickOutside(
  refOrRefs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: Event) => void
) {
  useEffect(() => {
    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs]

    const listener = (event: Event) => {
      if (refs.some((ref) => ref.current?.contains(event.target as Node))) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refOrRefs, handler])
}
