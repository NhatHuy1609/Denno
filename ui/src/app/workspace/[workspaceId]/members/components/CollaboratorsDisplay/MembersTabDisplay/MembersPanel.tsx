import React, { useRef } from 'react'
import NameFilterInput from '../NameFilterInput'

function MembersPanel() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='w-full'>
      <NameFilterInput ref={inputRef} />
      <div className='mt-4 h-[100px] w-full border-y border-gray-300 py-2'></div>
    </div>
  )
}

export default MembersPanel
