import React, { useRef } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

function GuestsFilterInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='my-2 w-full'>
      <PrimaryInputText placeholder='Filter by name' ref={inputRef} className='border border-gray-400 p-2' />
    </div>
  )
}

export default GuestsFilterInput
