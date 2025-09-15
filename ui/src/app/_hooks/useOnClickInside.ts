import React, { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

export const useOnClickInside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current

      // Nếu click vào element hoặc con của nó thì gọi handler
      if (el && el.contains(event.target as Node)) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
